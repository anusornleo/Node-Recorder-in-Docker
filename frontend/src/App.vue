<template>
  <div id="app">
    <label>
      APP ID
      <input type="text" v-model="appId">
    </label>
    <br><br>
    <label>
      Channel Name
      <input type="text" v-model="channel">
    </label>
    <br>
    <br>
    <span v-if="startLoading">Loading...</span>
    <button v-else @click="startRecord">Start Record</button>
    <br>
    <br>
    <div>Response : </div>
    <span>{{ responseStart }}</span>
    <br>
    <br>
    <br>
    <br>
    <label>
      SID for stop
      <input type="text" v-model="sid">
    </label>
    <br>
    <br>
    <span v-if="stopLoading">Loading...</span>
    <button v-else @click="stopRecord">Stop Record</button>
    <br>
    <br>
    <span>Link Video : <a :href="resultVideo" target="_blank">{{ resultVideo }}</a></span>
    <br>
    <br>
    <div>Response :</div>
    {{responseStop}}
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      appId: localStorage.appId || '',
      channel: localStorage.channel || '',
      sid: '',
      showSid: 'none',
      resultVideo: '',
      startLoading: false,
      stopLoading: false,
      responseStart: '',
      responseStop: ''
    }
  },
  methods: {
    startRecord() {
      this.startLoading = true
      this.resultVideo = ''
      localStorage.appId =  this.appId
      localStorage.channel = this.channel
      axios.post('/recorder/start', {
        appid: this.appId,
        channel: this.channel,
        // tokenKey:tokenKey,
        width: 640,
        height: 480
      }).then(res => {
        console.log(res)
        this.showSid = res.data.sid
        this.sid = res.data.sid
        this.responseStart = res.data
        this.startLoading = false
      }).catch(e => {
        console.log(e)
        this.responseStart = e
        this.startLoading = false
      })
    },
    stopRecord() {
      this.stopLoading = true
      axios.post('/recorder/stop', {
        sid: this.sid,
      }).then(res => {
        this.resultVideo = `${window.location.protocol}//${window.location.hostname}${res.data.path}`
        console.log(res)
        this.responseStart = ''
        this.responseStop =  res.data
        this.stopLoading = false
      }).catch(e => {
        console.log(e)
        this.responseStop =  e.message
        this.stopLoading = false
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
