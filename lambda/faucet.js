const axios = require('axios')
require('dotenv').config()

const {
  // createCosmosAddress,
  sign,
  // createSignature,
  // createSignMessage,
  generateWalletFromSeed,
  // generateSeed,
  // generateWallet,
  createSignedTx
  // createBroadcastBody
} = require('js-cosmos-wallet')
// const GoogleRecaptcha = require('google-recaptcha')
// const googleRecaptcha = new GoogleRecaptcha({
//   secret: process.env.GOOGLE
// })
const restEndpoint = 'http://localhost:1317'
let tx = {
  'msg': [
    {
      'type': 'cosmos-sdk/MsgSend',
      'value': {
        'from_address': process.env.ADDRESS,
        'to_address': null,
        'amount': [
          {
            'denom': 'nametoken',
            'amount': '1'
          }
        ]
      }
    }
  ],
  'fee': {
    'amount': [
      {
        'denom': 'nametoken',
        'amount': '1'
      }
    ],
    'gas': '200000'
  },
  'signatures': null,
  'memo': ''
}
exports.handler = async function (event, context) {
  // let headers = {
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  //   'Access-Control-Allow-Headers':
  //     'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  // }
  // if (event.httpMethod === 'POST') {
  // if (event.body) {
  // let body = JSON.parse(event.body)
  let recepient = 'cosmos1rug63vk7tr6nha8aw55v9geg88v3pgp74n90te' // body.recepient
  // let recaptchaResponse = body.recaptchaToken
  // let error = await new Promise((resolve, reject) => {
  //   googleRecaptcha.verify({ response: recaptchaResponse }, async (error) => {
  //     if (error) { reject(error) } else { resolve() }
  //   })
  // })
  // if (error) {
  //   console.error(error)
  //   return {
  //     statusCode: 400,
  //     body: error.message
  //   }
  // } else {
  try {
    // prepare tx
    const wallet = generateWalletFromSeed(process.env.MNEMONIC)
    const requestMetadata = await getMetadata()
    requestMetadata.chain_id = process.env.CHAIN_ID
    tx.msg[0].value.to_address = recepient
    tx = createSignedTx(tx, sign(tx, wallet, requestMetadata))
    let body = {
      tx,
      mode: 'block'
    }
    // send tx
    let res = await axios
      .post(
        restEndpoint + '/txs',
        body
      )
    return {
      statusCode: res.status,
      body: JSON.stringify(res.data)
    }
  } catch (error) {
    return handleAxiosError(error)
  }
  // }
  // } else {
  //   return {
  //     statusCode: 404,
  //     body: '¯\\_(ツ)_/¯'
  //   }
  // }
  // } else {
  //   return {
  //     statusCode: 200,
  //     body: ':)'
  //   }
  // }
}

async function getMetadata () {
  let response = await axios.get(restEndpoint + '/auth/accounts/' + process.env.ADDRESS)
  return response.data.result.value
}

function handleAxiosError (error) {
  console.error(error)
  return {
    statusCode: !error.response ? 500 : error.response.status,
    body: !error.response ? error.message : error.response.statusText + (error.response.data && error.response.data.error ? '\n' + error.response.data.error : '')
  }
}
