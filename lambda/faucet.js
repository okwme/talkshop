const axios = require('axios')
require('dotenv').config()

const { createWalletFromMnemonic, createAddress, signTx, verifyTx } = require('@tendermint/sig');
const wallet = createWalletFromMnemonic(process.env.MNEMONIC); // BIP39 mnemonic string
const address = createAddress(wallet.publicKey); // Buffer or Uint8Array
const restEndpoint = process.env.URL

// const {Bech32} = require("@cosmjs/encoding")
const GoogleRecaptcha = require('google-recaptcha')
const googleRecaptcha = new GoogleRecaptcha({
  secret: process.env.GOOGLE
})

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
      console.log({body})
      let recipient = body.recipient

      // let foo
      // try {
      //   foo = Bech32.decode(recipient)
      //   console.log({foo})
      // } catch (err) {
      //   console.log({err})
      //   console.log("NEED TO RESOLVE")

      //   recipient = await getValue(recipient)
      //   try {
      //     foo = Bech32.decode(recipient)
      //   } catch (err) {
      //     console.log("STILL NEED TO RESOLVE")
      //     return {
      //       statusCode: 400,
      //       body: JSON.stringify(err)
      //     }
      //   }
      // }


      let recaptchaResponse = body.recaptchaToken
      let response
      try  {
        response = await new Promise((resolve, reject) => {
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
          const result = await submitWithTendermintSig(recipient)
          return {
            statusCode: 200,
            body: JSON.stringify(result.data)
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


async function submitWithTendermintSig(recipient) {
  const tx = {
    fee:  {
        amount: [{ amount: '0', denom: '' }],
        gas:    '200000'
    },
    memo: '',
    msg: [{
        type:  'cosmos-sdk/MsgSend',
        value: {
            amount:  [{ amount: '1', denom: 'nametoken' }],
            from_address: address,
            to_address: recipient
        }
    }]
  };
  console.log({tx})
  const signMeta = (await getMetadata(address)).value
  signMeta.chain_id = process.env.CHAINID
  const stdTx = signTx(tx, signMeta, wallet); // Wallet or privateKey / publicKey pair; see example above
  const valid = verifyTx(stdTx, signMeta); // signed transaction and metadata; see example above
  if (!valid) {
    return {
      statusCode: 500,
      body: JSON.stringify(stdTx)
    }
  }
  const submitTx = {
    msg: stdTx.msg,
    fee: stdTx.fee,
    memo: stdTx.memo,
    signatures: stdTx.signatures
  }
  const body = {
    tx: submitTx,
    mode: 'sync'
  }
  return axios.post(restEndpoint + '/txs', body)
}

async function getMetadata (address) {
  let response = await axios.get(restEndpoint + '/auth/accounts/' + address)
  console.log(response.data.result)
  return response.data.result
}

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
