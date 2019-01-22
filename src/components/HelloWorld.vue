<template>
  <div class="hello">
    <textarea spellcheck="false">
    # query an account
    $ nscli query account $(nscli keys show YOUR_NAME --address) \
    --indent --chain-id testchain --node=node.talkshop.name:26657

    # buy a name!
    $ nscli tx nameservice buy-name SOME_DOMAIN 5mycoin \
    --from     $(nscli keys show YOUR_NAME --address) \
    --chain-id testchain --node=node.talkshop.name:26657

    # set a resolver
    $ nscli tx nameservice set-name SOME_DOMAIN SOME_VALUE\
    --from     $(nscli keys show YOUR_NAME --address) \
    --chain-id testchain --node=node.talkshop.name:26657

    # resolve a name
    $ nscli query nameservice resolve SOME_DOMAIN \
    --chain-id testchain --node=node.talkshop.name:26657

    # get the whole whois of a name
    $ nscli query nameservice whois SOME_DOMAIN \
    --chain-id testchain --node=node.talkshop.name:26657
    </textarea>
    <br>
    Add your account <a href="https://goo.gl/forms/6OFVtc2eDIbVxofU2" target="_blank">here</a> to get some money!

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
textarea {
  text-align: left;
  width: 100%;
  max-width:580px;
  height:420px;
  font-size:14px;
  font-family: monospace;
  padding:20px;
  line-height:1.4em;
  color: rgb(60, 60, 60);
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: white;
  text-decoration: none;
}
</style>
