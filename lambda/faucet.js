const axios = require('axios')
require('dotenv').config()
global.window = global

const {
  // createCosmosAddress,
  // sign,
  // createSignature,
  // createSignMessage,
  // generateWalletFromSeed,
  // generateSeed,
  // generateWallet,
  createSignedTx,
  signWithPrivateKey
  // createBroadcastBody
} = require('js-cosmos-wallet')
// const Cosmos = require('../node_modules/@lunie/cosmos-js/src/index.js')
// console.log({Cosmos})
const { getNewWalletFromSeed } = require('@lunie/cosmos-keys')
// // const GoogleRecaptcha = require('google-recaptcha')
// // const googleRecaptcha = new GoogleRecaptcha({
// //   secret: process.env.GOOGLE
// // })
const restEndpoint = 'http://localhost:1317'
const ALICE = 'cosmos1rug63vk7tr6nha8aw55v9geg88v3pgp74n90te'
const wallet = getNewWalletFromSeed(process.env.MNEMONIC, 'cosmos')
const { cosmosAddress, privateKey, publicKey } = wallet
console.log({cosmosAddress})
// const _privateKey = Buffer.from(privateKey)

// create a signer from this local js signer library
// const localSigner = (signMessage) => {
//   const signature = signWithPrivateKey(signMessage, privateKey)

//   return {
//     signature,
//     publicKey
//   }
// }
const stdTx = {

  'msg': [
    {
      'type': 'cosmos-sdk/MsgSend',
      'value': {
        'from_address': cosmosAddress,
        'to_address': ALICE,
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

// const stdTx = {
// 	"type": "cosmos-sdk/StdTx",
// 	"value": {
// 		"msg": [
// 			{
// 				"type": "cosmos-sdk/MsgSend",
// 				"value": {
// 					"from_address": "cosmos1afyv0f96e6mqxkmh83xtj3s6fy0zd2344q0vj7",
// 					"to_address": "cosmos1rug63vk7tr6nha8aw55v9geg88v3pgp74n90te",
// 					"amount": [
// 						{
// 							"denom": "nametoken",
// 							"amount": "1"
// 						}
// 					]
// 				}
// 			}
// 		],
// 		"fee": {
// 			"amount": [],
// 			"gas": "200000"
// 		},
// 		"signatures": null,
// 		"memo": ""
// 	}
// }

// const stdTx = {
//   msg: [
//     {
//       type: `cosmos-sdk/Send`,
//       value: {
//         inputs: [
//           {
//             address: cosmosAddress,
//             coins: [{ denom: `nametoken`, amount: `1` }]
//           }
//         ],
//         outputs: [
//           {
//             address: ALICE,
//             coins: [{ denom: `nametoken`, amount: `1` }]
//           }
//         ]
//       }
//     }
//   ],
//   fee: { amount: [{ denom: ``, amount: `0` }], gas: `21906` },
//   signatures: null,
//   memo: ``
// }
async function getMetadata () {
  let response = await axios.get(restEndpoint + '/auth/accounts/' + cosmosAddress)
  return response.data.result.value
}

exports.handler = async function (event, context) {
  // let headers = {
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  //   'Access-Control-Allow-Headers':
  //     'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  // }
  console.log({privateKey, publicKey})
  console.log({stdTx})
  console.log(Buffer.from(privateKey, 'hex'), Buffer.from(publicKey, 'hex'))
  const requestMetadata = await getMetadata()
  console.log({requestMetadata})
  const tx = createSignMessage(stdTx, requestMetadata)
  console.log({tx})
  // const wallet = generateWalletFromSeed(process.env.MNEMONIC)
  // console.log({wallet})
  const signed = sign(tx, wallet)
  console.log({signed})
  const signature = createSignedTx(stdTx, signed)

  // const signature = signWithPrivateKey(signMessage, Buffer.from(privateKey))
  console.log({signature})

  let body = {
    tx: signature,
    mode: 'sync'
  }
  console.log({body})
  // send tx
  // let res = await axios
  //   .post(
  //     restEndpoint + '/txs',
  //     body
  //   )
  // console.log({res})

  // const cosmos = Cosmos(restEndpoint, cosmosAddress)
  // console.log({cosmos})
  // const msg = cosmos
  //   .MsgSend({toAddress: ALICE, amounts: [{ denom: 'nametoken', amount: 1 }]})
  // const gasEstimate = await msg.simulate()
  // console.log({gasEstimate})
  // const { included } = await msg.send({ gas: gasEstimate }, localSigner)
  // await included()
  // console.log({_privateKey, publicKey})
  return {
    statusCode: 200,
    body: JSON.stringify({body, tx})
  }

  // if (event.httpMethod === 'POST') {
  //   if (event.body) {
  //     let body = JSON.parse(event.body)
  //     let recepient = body.recepient
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
  //         // prepare tx
  //         const wallet = generateWalletFromSeed(process.env.MNEMONIC)
  //         const requestMetadata = await getMetadata()
  //         requestMetadata.chain_id = process.env.CHAIN_ID
  //         tx.msg[0].value.to_address = recepient
  //         tx = createSignedTx(tx, sign(tx, wallet, requestMetadata))
  //         let body = {
  //           tx,
  //           return: 'block'
  //         }
  //         // send tx
  //         let res = await axios
  //           .post(
  //             restEndpoint + '/txs',
  //             body
  //           )
  //         return {
  //           statusCode: res.status,
  //           body: JSON.stringify(res.data)
  //         }
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

function handleAxiosError (error) {
  console.error(error)
  return {
    statusCode: !error.response ? 500 : error.response.status,
    body: !error.response ? error.message : error.response.statusText + (error.response.data && error.response.data.error ? '\n' + error.response.data.error : '')
  }
}

function sign (signMessage, wallet) {
  console.log('sign')
  // const signMessage = createSignMessage(jsonTx, requestMetaData)
  if (typeof signMessage === 'object') {
    console.log('IS NOT STRING')
    signMessage = JSON.stringify(signMessage)
  } else {
    console.log('IS STRING')
  }
  const signatureBuffer = signWithPrivateKey(signMessage, wallet.privateKey)
  console.log({signatureBuffer})
  const pubKeyBuffer = Buffer.from(wallet.publicKey, `hex`)
  console.log({pubKeyBuffer})
  return createSignature(
    signatureBuffer,
    // requestMetaData.sequence,
    // requestMetaData.account_number,
    pubKeyBuffer
  )
}

function createSignMessage (
  jsonTx,
  { sequence, account_number, chainId }
) {
  console.log('createSignMessage')
  console.log({jsonTx})
  // sign bytes need amount to be an array
  const fee = {
    amount: jsonTx.fee.amount || [],
    gas: jsonTx.fee.gas
  }

  return JSON.stringify(
    removeEmptyProperties({
      account_number: account_number,
      chain_id: chainId
      fee,
      memo: jsonTx.memo,
      msgs: jsonTx.msg,
      sequence: sequence,
    })
  )
}

function createSignature (
  signature,
  // sequence,
  // accountNumber,
  publicKey
) {
  console.log('createSignature')
  return {
    signature: signature.toString(`base64`),
    // account_number: accountNumber,
    // sequence,
    pub_key: {
      type: `tendermint/PubKeySecp256k1`, // TODO: allow other keytypes
      value: publicKey.toString(`base64`)
    }
  }
}

function removeEmptyProperties (obj) {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(removeEmptyProperties)
  const sortedKeys = Object.keys(obj).sort()
  const result = {}
  sortedKeys.forEach(key => {
    result[key] = removeEmptyProperties(obj[key])
  })
  return result
  // console.log('removeEmptyProperties')
  // if (Array.isArray(jsonTx)) {
  //   return jsonTx.map(removeEmptyProperties)
  // }

  // // string or number
  // if (typeof jsonTx !== `object`) {
  //   return jsonTx
  // }

  // const sorted = {}
  // Object.keys(jsonTx)
  //   .sort()
  //   .forEach(key => {
  //     if (jsonTx[key] === undefined || jsonTx[key] === null) return

  //     sorted[key] = removeEmptyProperties(jsonTx[key])
  //   })
  // return sorted
}
