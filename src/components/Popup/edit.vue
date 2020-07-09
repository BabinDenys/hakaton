<template>
  <div class="page">
    <div :class="{'page-container': !animation, 'page-container-animation': animation}">
      <div class="header"/>
      <div class="icon-container" @click="goToProduct()">
        <img class="icon-container_back" src="../../../public/back.svg" alt="">
      </div>
      <div class="icon-container-exit" @click="exit()">
        <img class="icon-container-exit_exit" src="../../../public/exit.svg" alt="">
      </div>
      <div v-if="!isPhotoChanged" class="block-photo">
        <div
          class="product-item__img"
          :style="{ 'background-image': !!product.image ? `url('${product.image}')` : `url(${photo})`}"
        />
      </div>
  
      <div v-if="isPhotoChanged" class="block-upload">
        <el-upload
          action=""
          ref="upload"
          class="upload-demo"
          :class="{'upload-demo-2': isUploaded}"
          list-type="picture-card"
          :on-change="handleChange"
          :before-remove="handleRemove"
          :file-list="fileList"
          :limit="limit"
          :auto-upload="false"
          :http-request="sendFile"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </div>
      <div class="btn-div">
        <el-button v-if="!isPhotoChanged" type="primary" @click="changePhotostatus(1)" class="btn-edit-photo">Изменить фотографию</el-button>
        <el-button v-if="isPhotoChanged" type="primary" @click="changePhotostatus(2)" class="btn-edit-photo">Оставить предыдущую</el-button>
      </div>
      
      <div class="block">
        <p>Категория: {{ product.category }}</p>
      </div>
      <div class="block">
        <p>Название товара</p>
        <el-input v-model="product.name" placeholder="Название товара" @input="changedInput()" />
      </div>
      <el-switch
        class="block"
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
      <el-button type="success" @click="editProduct()" class="btn-edit">Изменить товар</el-button>
    </div>
  </div>
</template>

<script>
import request from '../../utils/request'
import photo from '../../../public/anonim.jpg'
import store from '@/store'

export default {
  name: 'Edit',
  props: ['id'],
  data() {
    return {
      isUploaded: false,
      fileList: [],
      limit: 1,
      isPhotoChanged: false,
      animation: true,
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
  mounted() {
    store.dispatch('popup/editPopup')
    request({
      url: `/content/products/${this.id}/`,
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
  methods: {
    sendFile(options) {
      this.formData = new FormData()
      this.formData.append('image', options.file)
    },
    handleChange(file, fileList) {
      this.isUploaded = true
    },
    handleRemove(file, fileList) {
      setTimeout(() => {
        this.isUploaded = false
      }, 1000)
    },
    changePhotostatus(param) {
      if (param === 1) {
        this.isPhotoChanged = !this.isPhotoChanged
      } else {
        this.isPhotoChanged = !this.isPhotoChanged
        this.isUploaded = false
      }
      
 
    },
    editProduct() {
      request({
        url: `/content/products/${this.id}/`,
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
          this.$emit('goToProduct')
          this.$emit('updateTable')
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
    goToProduct() {
      this.$emit('goToProduct')
    },
    exit() {
      this.$emit('exit')
      this.animation = false
    },
  },
}
</script>

<style scoped>
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

  .block {
    margin-bottom: 20px;
    margin-left: 20px;
  }

  .product-item__img {
    height: 100px;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    margin-bottom: 8px;
  }

  .icon-container {
    position: absolute;
    top: 13px;
    left: 20px;
  }
  .icon-container_back {
    width: 24px;
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
  .btn-edit {
    margin-left: 20px;
  }
  .block-upload {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  .btn-div {
    display: flex;
    justify-content: center;
  }
  .block-photo {
    display: flex;
    justify-content: center;
  }

</style>

<style>
  .upload-demo-2 .el-upload {
    background-color: rgba(0,0,0,0);
    border: none;
  }
  
  .upload-demo-2 .el-upload .el-icon-plus {
    display: none;
  }
  .block-upload .el-upload-list__item {
    position: absolute;
  }
</style>
