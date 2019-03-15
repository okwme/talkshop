<template>
  <div id="names">
    <div :key="name" v-for="name in names">
      <h2>{{ name }}</h2>
      <div class="left-align" v-if="whois[name] && !loading">
        <b>Value: </b>{{ whois[name].value || 'N/A' }}<br />
        <b>Owner: </b>{{ whois[name].owner }}<br />
        <b>Price:&nbsp;&nbsp;&nbsp;</b>{{ whois[name].price[0].amount }}
        {{ whois[name].price[0].denom }}
      </div>
      <div v-else>
        Loading Data...
      </div>
    </div>
    <div v-if="names.length == 0 && !loading">
      No Names Found
    </div>
    <div v-if="names.length == 0 && loading">
      Loading Names...
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
    this.check()
    this.interval = setInterval(() => {
      this.check()
    }, 5000)
  },
  destroyed () {
    clearInterval(this.interval)
  },
  methods: {
    check () {
      console.log('check loading = true')
      this.loading = true
      axios('https://node.talkshop.name/nameservice/names', {
        method: 'GET'
      }).then(res => {
        console.log('check loading = false')
        this.loading = false
        if (res.length === 0) return
        let names = res.data// .split('::::')
        this.names = names
        this.checknames()
      })
    },
    checknames (num = 0) {
      for (let i = 0; i < this.names.length; i++) {
        this.checkname(i)
      }
    },
    async checkname (num) {
      console.log('checkname loading = true')
      console.time()
      this.loading = true
      let name = this.names[num]
      let res = await axios.get(
        'https://node.talkshop.name/nameservice/names/' + name + '/whois'
      )
      console.log(res.data)
      this.whois[name] = Object.assign({}, this.whois[name], res.data)
      console.log('checkname loading = false')
      this.loading = false
      console.timeEnd()
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
