// const axios = require('axios')
require('dotenv').config()

const GoogleRecaptcha = require('google-recaptcha')
const googleRecaptcha = new GoogleRecaptcha({
  secret: process.env.GOOGLE
})
const cosmosjs = require('@cosmostation/cosmosjs')
const chainId = process.env.CHAINID
const restEndpoint = process.env.URL
const cosmos = cosmosjs.network(restEndpoint, chainId)
cosmos.setPath("m/44'/118'/0'/0/0")
const address = cosmos.getAddress(process.env.MNEMONIC)
const ecpairPriv = cosmos.getECPairPriv(process.env.MNEMONIC)
exports.handler = async function (event, context) {
  // let headers = {
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  //   'Access-Control-Allow-Headers':
  //     'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  // }
  if (event.httpMethod === 'POST') {
    if (event.body) {
      let body = JSON.parse(event.body)
      let recipient = body.recipient
      let recaptchaResponse = body.recaptchaToken
      let error = await new Promise((resolve, reject) => {
        googleRecaptcha.verify({ response: recaptchaResponse }, async (error) => {
          if (error) { reject(error) } else { resolve() }
        })
      })
      if (error) {
        console.error(error)
        return {
          statusCode: 400,
          body: error.message
        }
      } else {
        try {
          const data = await cosmos.getAccounts(address)
          let stdSignMsg = cosmos.NewStdMsg({
            type: 'cosmos-sdk/MsgSend',
            from_address: address,
            to_address: recipient,
            amountDenom: 'nametoken',
            amount: 1,
            feeDenom: 'nametoken',
            fee: 0,
            gas: 200000,
            memo: 'have a little nametoken',
            account_number: data.result.value.account_number,
            sequence: data.result.value.sequence
          })
          const signedTx = cosmos.sign(stdSignMsg, ecpairPriv)
          const response = await cosmos.broadcast(signedTx)
          return {
            statusCode: 200,
            body: JSON.stringify(response)
          }
        } catch (error) {
          return handleAxiosError(error)
        }
      }
    } else {
      return {
        statusCode: 404,
        body: '¯\\_(ツ)_/¯'
      }
    }
  } else {
    return {
      statusCode: 200,
      body: ':)'
    }
  }
}

// async function getMetadata () {
//   let response = await axios.get(restEndpoint + '/auth/accounts/' + process.env.ADDRESS)
//   // console.log(response.data.result)
//   return response.data
// }

function handleAxiosError (error) {
  console.error(error)
  return {
    statusCode: !error.response ? 500 : error.response.status,
    body: !error.response ? error.message : error.response.statusText + (error.response.data && error.response.data.error ? '\n' + error.response.data.error : '')
  }
}
