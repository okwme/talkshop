<template>
  <div class="hello">
    <textarea spellcheck="false">
                _  _ __, _,   _,  _, _, _ __,   ___  _,
                |  | |_  |   / ` / \ |\/| |_     |  / \
                |/\| |   | , \ , \ / |  | |      |  \ /
                ~  ~ ~~~ ~~~  ~   ~  ~  ~ ~~~    ~   ~

            ___  _, _,  _,_  _, _,_  _, __,  _, _  _, _, _ __,
             |  /_\ |   |_/ (_  |_| / \ |_)  |\ | /_\ |\/| |_
             |  | | | , | \ , ) | | \ / |  , | \| | | |  | |
             ~  ~ ~ ~~~ ~ ~  ~  ~ ~  ~  ~  ~ ~  ~ ~ ~ ~  ~ ~~~

    # create an account for yourself
    $ nscli keys add YOUR_NAME

    # query an account
    $ nscli query account $(nscli keys show YOUR_NAME --address) \
    --indent --chain-id namechain --node=node.talkshop.name:26657

    # send some money
    $ nscli tx send --amount 1nametoken \
    --chain-id namechain  --node=node.talkshop.name:26657 \
    --from $(nscli keys show YOUR_NAME --address) \
    --to $(nscli keys show THEIR_NAME --address)

    # buy a name!
    $ nscli tx nameservice buy-name SOME_DOMAIN 5nametoken \
    --from     $(nscli keys show YOUR_NAME --address) \
    --chain-id namechain --node=node.talkshop.name:26657

    # set a resolver
    $ nscli tx nameservice set-name SOME_DOMAIN SOME_VALUE\
    --from     $(nscli keys show YOUR_NAME --address) \
    --chain-id namechain --node=node.talkshop.name:26657

    # resolve a name
    $ nscli query nameservice resolve SOME_DOMAIN \
    --chain-id namechain --node=node.talkshop.name:26657

    # get the whole whois of a name
    $ nscli query nameservice whois SOME_DOMAIN \
    --chain-id namechain --node=node.talkshop.name:26657</textarea
    >
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
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
textarea {
  text-align: left;
  width: 100%;
  max-width: 580px;
  height: 400px;
  font-size: 14px;
  font-family: monospace;
  padding: 20px;
  line-height: 1.4em;
  background-color: grey;
  color: white;
  border: 0px;
  border-radius: 20px;
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
