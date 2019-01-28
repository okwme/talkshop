<template>
  <div id="names">
    <div :key="name" v-for="name in names">
      <h2>{{ name }}</h2>
      <div class="left-align" v-if="whois[name]">
        <b>Value: </b>{{ whois[name].value || 'N/A' }}<br />
        <b>Owner: </b>{{ whois[name].owner }}<br />
        <b>Price:&nbsp;&nbsp;&nbsp;</b>{{ whois[name].price[0].amount }}
        {{ whois[name].price[0].denom }}
      </div>
      <div v-else>
        Loading...
      </div>
    </div>
    <div v-if="names.length == 0 && !loading">
      No Names Found
    </div>
    <div v-if="names.length == 0 && loading">
      Loading...
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Names',
  data () {
    return {
      interval: null,
      names: [],
      whois: {},
      loading: true
    }
  },
  mounted () {
    this.interval = setInterval(() => {
      this.loading = true
      axios('https://node.talkshop.name/nameservice/names', {
        method: 'GET'
      }).then(res => {
        this.loading = false
        let names = res.data.split('::::')
        this.names = names
        this.checknames()
      })
    }, 5000)
  },
  destroyed () {
    clearInterval(this.interval)
  },
  methods: {
    checknames (num = 0) {
      for (let i = 0; i < this.names.length; i++) {
        this.checkname(i)
      }
    },
    async checkname (num) {
      this.loading = true
      let name = this.names[num]
      let res = await axios.get(
        'https://node.talkshop.name/nameservice/names/' + name + '/whois'
      )
      this.whois[name] = Object.assign({}, this.whois[name], res.data)
      this.loading = false
    }
  }
}
</script>

<style scoped>
.left-align,
h2 {
  max-width: 600px;
  margin: auto;
  text-align: left;
  margin-top: 1em;
}
#names {
  padding-bottom: 150px;
}
</style>
