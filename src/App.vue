<template>
  <div id="app">
    <h1>Talkshop Name Server</h1>
    <router-view/>
    <div class="footer">
      <a href="https://github.com/cosmos/sdk-application-tutorial" target="_blank">The Tutorial</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
    background: grey;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(60, 60, 60);
  margin-top: 60px;
  padding-bottom:150px;
}
.footer {
  position: fixed;
  bottom:0;
  left: 0;
  width:100%;
  height:150px;
  line-height:150px;
  background-color: rgb(60, 60, 60);
  color: white;
  text-decoration: none;
}
.footer a {
  color: white;
  text-decoration: none;
}
</style>
