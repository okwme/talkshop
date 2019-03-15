
// const {
// createCosmosAddress,
// sign,
// createSignature,
// createSignMessage,
// generateWalletFromSeed,
// generateSeed,
// generateWallet,
// createSignedTx,
// createBroadcastBody
// } = require('js-cosmos-wallet')

exports.handler = function (event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hellooo world ${Math.floor(Math.random() * 10)}`
    })
  })
}
