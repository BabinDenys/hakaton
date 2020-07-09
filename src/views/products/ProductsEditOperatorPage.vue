<template>
  <div class="page">

    <div class="page-container">

      <div class="block">
        <div
          class="product-item__img"
          :style="{ 'background-image': !!product.image ? `url('${product.image}')` : `url(${photo})`}"
        />
      </div>

      <div v-if="!changed" class="block">
        <p>Категория: {{ product.category }}</p>
      </div>

      <div class="block">
        <p>Название товара</p>
        <el-input v-model="product.name" placeholder="Название товара" @input="changedInput()" />
      </div>

      <el-switch
        v-model="product.by_weight"
        style="display: block"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="Весовой"
        inactive-text="Не весовой"
      />

      <div class="block">
        <p>Описание товара</p>
        <el-input v-model="product.description" type="textarea" placeholder="Описание товара" />
      </div>

      <el-button type="success" @click="editProduct()">Изменить товар</el-button>

    </div>
  </div>
</template>

<script>
import request from '../../../src/utils/request'
import photo from '../../../public/anonim.jpg'

export default {
  components: {
  },
  data() {
    return {
      photo: photo,
      loading: false,
      categoryOptions: [],
      byWeightOptions: [{
        value: true,
        label: 'Весовой',
      }, {
        value: false,
        label: 'Не весовой',
      }],
      productValue: '',
      categoryValue: '',
      byWeightValue: true,
      descriptionValue: '',
      photoValue: '',
      product: {},
      changed: false,
      categoryValueOld: '',
      validProductName: {
        mask: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
        tokens: {
          C: {
            pattern: /^[а-яА-ЯёЁa-zA-Z -]+$/,
            // transform: v => v.toLocaleUpperCase()
          },
        },
      },
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
        this.product = res.data
        this.loading = false
      })
      .catch((res) => {
        this.loading = false
      })
  },
  mounted() {
  },
  methods: {
    editProduct() {
      request({
        url: `/content/products/${this.$route.params.id}/`,
        method: 'patch',
        headers: {
          Authorization: this.$store.state.user.token,
        },
        data: {
          name: this.product.name,
          by_weight: this.product.by_weight,
          description: this.product.description,
        },
      })
        .then(() => {
          this.loading = false
          this.$message({
            showClose: true,
            message: 'Редактирование прошло успешно',
            type: 'success',
          })
          this.$router.push({ path: `/operator/product/${this.$route.params.id}` })
        })
        .catch((res) => {
          this.loading = false
          this.$message({
            showClose: true,
            message: 'Не получилось редактировать товар',
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
          this.categoryValueOld = res.data.name
        })
    },
    changedInput() {
      let validated = this.product.name.replace(/ +/g, ' ').trimStart()

      if (validated.trim() === '') {
        this.product.name = ''
        return
      }

      validated = validated[0].toUpperCase() + validated.slice(1)
      this.product.name = validated
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
