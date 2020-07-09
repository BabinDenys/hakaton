<template>
  <div id="app">
    <router-view />
    <loader :is-visible="isLoading"></loader>
  </div>
</template>

<script>
import loader from '../src/components/Loader/index'
import request from '../src/utils/request'

export default {
  name: 'App',
  mounted() {
    this.enableInterceptor()
  },
  data() {
    return {
      isLoading: false,
      axiosInterceptor: null,
    }
  },
  components: {
    loader,
  },
  methods: {
    enableInterceptor(id) {
      this.axiosInterceptor = request.interceptors.request.use((config) => {
        this.isLoading = true
        return config
      }, (error) => {
        this.isLoading = false
        return Promise.reject(error)
      })

      request.interceptors.response.use((response) => {
        this.isLoading = false
        return response
      }, (error) => {
        this.isLoading = false
        return Promise.reject(error)
      })
    },

    disableInterceptor() {
      request.interceptors.request.eject(this.axiosInterceptor)
    },
  },
}
</script>

<style>
.el-message {
  min-width: 220px;
}

.container-for-text {
  overflow: auto;
  padding: 20px 0;
}
.container-for-text div{
  word-break: normal;
}
.container-word-break {
  word-break: normal;
}
.el-dialog__body {
  padding: 0 30px;
}
</style>
