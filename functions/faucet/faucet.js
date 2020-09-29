// const axios = require('axios')
// require('dotenv').config()
// const { createWalletFromMnemonic, createAddress, signTx, verifyTx } = require('@tendermint/sig');
// const wallet = createWalletFromMnemonic(process.env.MNEMONIC); // BIP39 mnemonic string
// const address = createAddress(wallet.publicKey); // Buffer or Uint8Array
const restEndpoint = process.env.NODE_URL

const {Bech32} = require("@cosmjs/encoding")

const GoogleRecaptcha = require('google-recaptcha')
console.log(process.env.GOOGLE)
const googleRecaptcha = new GoogleRecaptcha({
  secret: process.env.GOOGLE
})


const {
  coins,
  // MsgSubmitProposal,
  // OfflineSigner,
  // PostTxResult,
  SigningCosmosClient,
  OfflineSigner,
  Secp256k1Wallet,
  // StdFee,
} = require("@cosmjs/launchpad");

let signer

exports.handler = async function (event, context) {
  signer = await Secp256k1Wallet.fromMnemonic(process.env.MNEMONIC)
  // console.log({signer})
  // let headers = {
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  //   'Access-Control-Allow-Headers':
  //     'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  // }
  if (event.httpMethod === 'POST') {
    if (event.body) {
      let body = JSON.parse(event.body)
      console.log({body})
      let recipient = body.recipient
      try {
        Bech32.decode(recipient)
      } catch (err) {
        console.log("NEED TO RESOLVE")
        console.log({err})

        try {
          recipient = await getValue(recipient)
          Bech32.decode(recipient)
        } catch (err) {
          console.log("STILL NEED TO RESOLVE")
          return {
            statusCode: 400,
            body: JSON.stringify(err)
          }
        }
      }


      let recaptchaResponse = body.recaptchaToken
      let response
      try  {
        response = await new Promise((resolve, reject) => {
          console.log({googleRecaptcha})
          googleRecaptcha.verify({ response: recaptchaResponse }, async (error, response) => {
            if (error) { reject(error) } else { resolve(response) }
          })
        })
        console.log({response})
      } catch (error) {
        console.log({error})
         return {
          statusCode: 400,
          body: error.message
        }
      }
      
      if (!response.success) {
        console.error(response)
        return {
          statusCode: 400,
          body: JSON.stringify(response)
        }
      } else {
        try {
          const result = await submitWithCosmJS(recipient)
          return {
            statusCode: 200,
            body: JSON.stringify(result.data)
          }
        } catch (error) {
          console.log({error})
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

async function submitWithCosmJS(recipient) {
  const [{address}] = await signer.getAccounts();
  console.log({address})
  const memo = ''
  const msg = {
    type:  'cosmos-sdk/MsgSend',
    value: {
        amount:  [{ amount: '1', denom: 'nametoken' }],
        from_address: address,
        to_address: recipient
    }
  };
  const fee = {
    amount: coins(0, ''),
    gas: "200000",
  };
  console.log({restEndpoint})
  const client = new SigningCosmosClient(restEndpoint, address, signer);
  console.log({client})
  return client.signAndPost([msg], fee, memo);

}

// async function submitWithTendermintSig(recipient) {
//   const tx = {
//     fee:  {
//         amount: [{ amount: '0', denom: '' }],
//         gas:    '200000'
//     },
//     memo: '',
//     msg: [{
//         type:  'cosmos-sdk/MsgSend',
//         value: {
//             amount:  [{ amount: '1', denom: 'nametoken' }],
//             from_address: address,
//             to_address: recipient
//         }
//     }]
//   };
//   console.log({tx})
//   const signMeta = (await getMetadata(address)).value
//   console.log('success!')
//   signMeta.chain_id = process.env.CHAINID
//   const stdTx = signTx(tx, signMeta, wallet); // Wallet or privateKey / publicKey pair; see example above
//   console.log({stdTx})
//   const valid = verifyTx(stdTx, signMeta); // signed transaction and metadata; see example above
//   console.log("helooooooo")
//   if (!valid) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify(stdTx)
//     }
//   }
//   console.log("helooooooo2")
//   const submitTx = {
//     msg: stdTx.msg,
//     fee: stdTx.fee,
//     memo: stdTx.memo,
//     signatures: stdTx.signatures
//   }
//   console.log("helooooooo3")
//   const body = {
//     tx: submitTx,
//     mode: 'sync'
//   }
//   return axios.post(restEndpoint + '/txs', body)
// }

// async function getMetadata (address) {
//   let response = await axios.get(restEndpoint + '/auth/accounts/' + address)
//   console.log(response.data.result)
//   return response.data.result
// }

// async function getValue (name) {
//   let response = await axios.get(restEndpoint + '/nameservice/names/' + name)
//   return response.data.result.value
// }

function handleAxiosError (error) {
  console.error(error)
  return {
    statusCode: !error.response ? 500 : error.response.status,
    body: !error.response ? error.message : error.response.statusText + (error.response.data && error.response.data.error ? '\n' + error.response.data.error : '')
  }
}
