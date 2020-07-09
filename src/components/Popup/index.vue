<template>
  <div :class="{'page-container': !animation, 'page-container-animation': animation}">
    <div class="header"/>
    <div class="icon-container-exit" @click="exit()">
      <img class="icon-container-exit_exit" src="../../../public/exit.svg" alt="">
    </div>

    <div class="block">
      <div
        class="product-item__img"
        :style="{ 'background-image': !!product.image ? `url('${product.image}')` : `url(${photo})`}"
      />
    </div>

    <div class="block">
      <p>Категория: <b>{{ product.category }}</b></p>
    </div>

    <div class="block">
      <p>Название товара: <b>{{ product.name }}</b></p>
    </div>

    <div class="block">
      <p v-if="product.by_weight"> Тип товара: <b>Весовой</b></p>
      <p v-if="!product.by_weight"> Тип товара: <b>Не Весовой</b></p>
    </div>

    <div class="block">
      <p>Описание: <b>{{ product.description }}</b> </p>
    </div>

    <el-button type="success" @click="goToEdit(product.id)" class="btn-success">Редактировать</el-button>
    <el-button type="danger" @click="dialog(product.name)">Удалить</el-button>

  </div>
</template>

<script>
import request from '../../utils/request'
import photo from '../../../public/anonim.jpg'

export default {
  name: 'Index',
  components: {
  },
  props: ['id'],
  data() {
    return {
      product: {},
      photo: photo,
      this: this,
      dialogVisible: false,
      rowForDelete: null,
      animation: this.$store.state.popup.editBeforeProduct,
    }
  },

  watch: {
    $props: {
      handler() {
        this.getData()
      },
      deep: true,
      immediate: true,
    },
  },
  beforeCreate() {
  },
  mounted() {
    console.log(this.$store.state.popup.editBeforeProduct)
    this.getData()
    setTimeout(() => {
      this.animation = true
    }, 100)

  },
  methods: {
    dialog(name) {
      this.$emit('deleteProduct', name)
    },
    exit() {
      this.$emit('exit')
      this.animation = false
    },
    goToEdit() {
      this.$emit('changeToEdit')
    },
    getData() {
      request({
        url: `/content/products/${this.id}/`,
        method: 'get',
        headers: {
          Authorization: this.$store.state.user.token,
        },
      })
        .then((res) => {
          // Todo - добавить получение категории
          this.product = res.data
        })
        .catch((res) => {
        })
    },
    deleteProduct() {
      const id = this.id
      this.dialogVisible = false

      request({
        url: `/content/products/${id}/`,
        method: 'delete',
        headers: {
          Authorization: this.$store.state.user.token,
        },
      })
        .then(() => {
          this.loading = false
          this.$message({
            showClose: true,
            message: 'Товар удален',
            type: 'success',
          })
          this.$emit('deleteProduct',)
        })
        .catch((res) => {
          this.loading = false
          this.$message({
            showClose: true,
            message: 'Не получилось удалить товар',
            type: 'error',
          })
        })
    },
  },
}
</script>

<style scoped>
  .page-container {
    height: 100%;
    width: 450px;
    position: fixed;
    top: 0;
    right: -500px;
    z-index: 100;
    background-color: #fff9ff;
    padding: 0px !important;
    transition: right 1s;

  }
  .page-container-animation {
    height: 100%;
    width: 450px;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    background-color: #fff9ff;
    padding: 0px !important;
    transition: right 1s;
  }
  .product-item__img {
    height: 100px;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    margin-bottom: 8px;
  }
  .block {
    margin-bottom: 20px;
    margin-left: 20px;
  }
  .icon-container-exit {
    position: absolute;
    top: 13px;
    right: 20px;
  }
  .icon-container-exit_exit {
    width: 24px;
  }
  .header {
    width: 100%;
    height: 50px;
    background-color: rgb(48, 65, 85);
    margin-bottom: 20px;
  }
  .btn-success {
    margin-left: 20px;
  }
</style>

<style>
</style>
