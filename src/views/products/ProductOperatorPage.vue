<template>
  <div class="page">

    <div class="page-container">

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

      <el-button type="success" @click="goToEdit(product.id)">Редактировать</el-button>
      <el-button type="danger" @click="dialog(product)">Удалить</el-button>

      <el-dialog
        title="Подтверждение действия"
        class="dialog"
        :visible.sync="dialogVisible"
        width="320px">
        <div class="container-for-text">
          <div>Вы точно хотите удалить товар:
            <b>{{ productForDelete }}</b>?
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Закрыть</el-button>
          <el-button type="danger" @click="deleteProduct()">Удалить</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import request from '../../../src/utils/request'
import photo from '../../../public/anonim.jpg'

export default {
  data() {
    return {
      photo: photo,
      product: {},
      category: '',
      categoryValue: '',
      dialogVisible: false,
      id: '',
      productForDelete: '',
    }
  },
  beforeCreate() {
    this.loading = true
    request({
      url: `/content/products/${this.$route.params.id}/`,
      method: 'get',
      headers: {
        Authorization: this.$store.state.user.token,
      },
    })
      .then((res) => {
        // Todo - добавить получение категории
        this.product = res.data
        this.loading = false
      })
      .catch((res) => {
        this.loading = false
      })
  },
  components: {
  },
  mounted() {

  },
  methods: {
    goToEdit(id) {
      this.$router.push(`/operator/edit/${id}`)
    },
    dialog(prod) {
      this.id = prod.id
      this.productForDelete = prod.name
      this.dialogVisible = true
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
          this.$router.push(`/operator/list`)
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
    getCategoryName() {
      request({
        url: `/content/categories/${this.product.category}`,
        method: 'get',
        headers: {
          Authorization: this.$store.state.user.token,
        },
      })
        .then((res) => {
          this.categoryValue = res.data.name
        })
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
    padding: 20px;
  }

  .block {
    margin-bottom: 20px;
  }

  .product-item__img {
    height: 100px;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;

    margin-bottom: 8px;
  }

</style>

