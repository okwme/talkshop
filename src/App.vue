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

input {
  padding: 10px 5px;
  width: 100%;
  max-width: 400px;
  font-size: 16px;
  margin: 1em auto 0 auto;
  border: 0;
  border-bottom: 2px solid gray;
}

button {
  display: none;
}

body {
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(60, 60, 60);
  padding-bottom:50px;
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
  position: absolute;
  bottom:0;
  left: 0;
  width:100%;
  height:50px;
  line-height:50px;
  text-decoration: none;
  z-index:-1;
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
