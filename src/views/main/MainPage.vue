<template>
  <div class="page">
    <div class="page-container">
      <h1>Главная страница</h1>

      <div class="block">
        <el-button type="info" @click="goList">Список товаров</el-button>
      </div>

      <div class="block">
        <el-button type="success" @click="goProduct">Создать товар</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Getlist } from '@/api/list'

export default {
  data() {
    return {
    }
  },
  components: {
  },
  mounted() {
  },
  methods: {
    goList() {
      this.$router.push('products/list');
    },
    goProduct() {
      this.$router.push('products/create');
    }
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    text-align: center;
  }

  .filters-container {
    display: flex;
  }

  .filters-container > div {
    margin-right: 20px
  }

  .page-container {
    padding: 20px;
  }

  .block {
    margin-bottom: 20px;

    button {
      height: 60px;
      width: 100%;
    }
  }

</style>
