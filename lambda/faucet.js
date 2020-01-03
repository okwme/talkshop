const axios = require('axios')
require('dotenv').config()
const { createWalletFromMnemonic, createAddress, signTx, verifyTx } = require('@tendermint/sig');
const wallet = createWalletFromMnemonic(process.env.MNEMONIC); // BIP39 mnemonic string
// console.log({wallet})
const address = createAddress(wallet.publicKey); // Buffer or Uint8Array
// console.log({address})
// const restEndpoint = process.env.URL
const recipient = 'cosmos1pucaeg92vy9r6w8xl6dqcyca7a79uyd9nyua2y'
// const GoogleRecaptcha = require('google-recaptcha')
// const googleRecaptcha = new GoogleRecaptcha({
//   secret: process.env.GOOGLE
// })
const tx = {
  fee:  {
      amount: [{ amount: '0', denom: 'nametoken' }],
      gas:    '200000'
  },
  memo: '',
  msgs: [{
      type:  'cosmos-sdk/MsgSend',
      value: {
          amount:  [{ amount: '1', denom: 'nametoken' }],
          from_address: address,
          to_address: recipient
      }
  }]
};
const cosmosjs = require('@cosmostation/cosmosjs')
const chainId = process.env.CHAINID
const restEndpoint = process.env.URL
const cosmos = cosmosjs.network(restEndpoint, chainId)
cosmos.setPath("m/44'/118'/0'/0/0")
// const address = cosmos.getAddress(process.env.MNEMONIC)
const ecpairPriv = cosmos.getECPairPriv(process.env.MNEMONIC)
exports.handler = async function (event, context) {
  // let headers = {
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  //   'Access-Control-Allow-Headers':
  //     'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  // }

    const signMeta = await getMetadata(address)
    // console.log({signMeta})
    const stdTx = signTx(tx, signMeta, wallet); // Wallet or privateKey / publicKey pair; see example above
    // console.log({stdTx})
    const valid = verifyTx(stdTx, signMeta); // signed transaction and metadata; see example above
    // console.log({valid})
    if (!valid) {
      return {
        statusCode: 500,
        body: JSON.stringify(stdTx)
      }
    }
    const submitTx = {
      msg: stdTx.msgs,
      fee: stdTx.fee,
      memo: stdTx.memo,
      signatures: stdTx.signatures
    }
    const body = {
      tx: submitTx,
      mode: 'sync'
    }
    // console.log({body})
    const result = await axios.post(restEndpoint + '/txs', 
      body
    ).catch(error => {console.log({error})})
    console.log({result: result.data})
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify(result)
    // }
  // if (event.httpMethod === 'POST') {
  //   if (event.body) {
  //     let body = JSON.parse(event.body)
  //     let recipient = body.recipient
  //     let recaptchaResponse = body.recaptchaToken
  //     let error = await new Promise((resolve, reject) => {
  //       googleRecaptcha.verify({ response: recaptchaResponse }, async (error) => {
  //         if (error) { reject(error) } else { resolve() }
  //       })
  //     })
  //     if (error) {
  //       console.error(error)
  //       return {
  //         statusCode: 400,
  //         body: error.message
  //       }
  //     } else {
  //       try {
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
            memo: '',
            account_number: data.result.value.account_number,
            sequence: data.result.value.sequence
          })
          // console.log({stdSignMsg})
          const signedTx = cosmos.sign(stdSignMsg, ecpairPriv)
          // console.log({signedTx})
          const response = await cosmos.broadcast(signedTx)
          console.log({response})
          return {
            statusCode: 200,
            body: JSON.stringify({signedTx, body})
          }
  //       } catch (error) {
  //         return handleAxiosError(error)
  //       }
  //     }
  //   } else {
  //     return {
  //       statusCode: 404,
  //       body: '¯\\_(ツ)_/¯'
  //     }
  //   }
  // } else {
  //   return {
  //     statusCode: 200,
  //     body: ':)'
  //   }
  // }
}

async function getMetadata (address) {
  let response = await axios.get(restEndpoint + '/auth/accounts/' + address)
  // console.log(response.data.result)
  return response.data.result
}

function handleAxiosError (error) {
  console.error(error)
  return {
    statusCode: !error.response ? 500 : error.response.status,
    body: !error.response ? error.message : error.response.statusText + (error.response.data && error.response.data.error ? '\n' + error.response.data.error : '')
  }
}
