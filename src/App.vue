<template>
  <div id="app">
    <h1>Talkshop Name Server</h1>
    <h2>With the Cosmos SDK</h2>
    <div id="menu">
      <router-link to="/">Commands</router-link>
      <router-link to="/names">Names</router-link>
    </div>
    <router-view/>
    <div class="footer">
      <h2>
          Add your account <a href="https://goo.gl/forms/6OFVtc2eDIbVxofU2" target="_blank">here</a> to get some money!
      </h2>
      <h2 class="tut">
        The <a href="https://github.com/cosmos/sdk-application-tutorial" target="_blank">SDK Application Tutorial</a> is on Github
      </h2>
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
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(60, 60, 60);
  padding-bottom:80px;
    letter-spacing: 1.5px;
}
#menu {
  display: flex;
  justify-content: space-around;
  max-width: 600px;
  margin: 20px auto;
}
a {
  color: grey;
  text-decoration: none;
}
#menu a.router-link-exact-active {
 text-decoration: underline;
 font-weight: bold;
}

.footer {
  border-top:1px solid black;
  position: fixed;
  bottom:0;
  left: 0;
  width:100%;
  height:100px;
  line-height:50px;
  text-decoration: none;

}
.footer h2 {
  padding: 0;
  margin:0;
  color: rgb(10,10,10);
  background-color:grey;

}
.footer a {
  color: white;
  text-decoration: none;
}
.footer h2.tut {
    color: grey;
    background-color: rgb(10,10,10);
}
</style>
