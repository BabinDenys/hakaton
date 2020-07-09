<template>
  <div class="page">
    <div class="page-container">

      <div class="block">
        Почта: pochta@gmail.com
      </div>
      <el-button type="success" round @click="logout()">Выйти</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
}
</script>

<style lang="scss" scoped>
  h1 {
    text-align: center;
  }

  .container {
    padding: 20px;
    margin: 20px;
  }

  .filters-container {
    display: flex;
  }

  .filters-container > div {
    margin-right: 20px
  }

  .page-container {
    padding: 20px 20px;
  }

  .block {
    margin-bottom: 20px;
  }

</style>

