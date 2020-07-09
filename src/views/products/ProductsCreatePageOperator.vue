<template>
  <div class="page">

    <div class="page-container">

      <div class="block">
        <p>Выберите категорию</p>
        <el-select v-model="categoryValue" placeholder="Категория">
          <el-option
            v-for="item in categoryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </div>

      <div class="block">
        <p>Название товара</p>
        <el-input v-model="productValue" placeholder="Название товара" @input="changedInput()" />
      </div>

      <el-switch
        v-model="byWeightValue"
        style="display: block"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="Весовой"
        inactive-text="Не весовой"
      />

      <div class="block">
        <p>Описание товара</p>
        <el-input v-model="descriptionValue" type="textarea" placeholder="Описание товара" />
      </div>

      <div class="block">
        <el-upload
          action=""
          ref="upload"
          class="upload-demo"
          :class="{'upload-demo-2': isUploaded}"
          list-type="picture-card"
          :on-change="handleChange"
          :before-remove="handleRemove"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :limit="limit"
          :auto-upload="false"
          :http-request="sendFile"
        >
          <div slot="tip" class="el-upload__tip">
            <p>
              файлы в форматах jpg/jpeg
            </p>
          </div>
          <i class="el-icon-plus" />
        </el-upload>
      </div>

      <el-button type="success" :disabled="!productValue || !categoryValue" @click="addProduct()">Создать Товар</el-button>

    </div>
  </div>
</template>

<script>
import request from '../../../src/utils/request'

export default {
  components: {
  },
  data() {
    return {
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
      limit: 1,
      validatedProductValue: '',
      isUploaded: false,
      validProductName: {
        mask: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
        tokens: {
          C: {
            pattern: /^[а-яА-ЯёЁa-zA-Z -]+$/,
            // transform: v => v.toLocaleUpperCase()
          },
        },
      },
      imageUrl: '',
      fileList: [],
    }
  },
  mounted() {
    this.loading = true
    request({
      url: `/content/categories/`,
      method: 'get',
      headers: {
        Authorization: this.$store.state.user.token,
      },
      params: {
        page: 1,
        page_size: 100000000,
      },
    })
      .then((res) => {
        this.categoryOptions = res.data.results
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
  },
  methods: {
    addProduct() {
      if (this.isUploaded) {
        this.$refs.upload.submit()
      } else {
        this.formData = new FormData()
      }

      this.formData.append('category', this.categoryValue)
      this.formData.append('name', this.productValue)
      this.formData.append('by_weight', this.byWeightValue)
      this.formData.append('description', this.descriptionValue)

      request({
        url: `/content/products/`,
        method: 'post',
        headers: {
          Authorization: this.$store.state.user.token,
        },
        data: this.formData,
      })
        .then(() => {
          this.loading = false
          this.$message({
            showClose: true,
            message: 'Товар добавлен',
            type: 'success',
          })
          this.categoryValue = ''
          this.productValue = ''
          this.descriptionValue = ''
          this.photoValue = ''
          this.$refs.upload.clearFiles()
          setTimeout(() => {
            this.isUploaded = false
          }, 1000)
        })
        .catch(() => {
          this.loading = false
          this.$message({
            showClose: true,
            message: 'Не получилось добавить товар',
            type: 'error',
          })
        })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
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
    changedInput() {
      let validated = this.productValue.replace(/ +/g, ' ').trimStart()

      if (validated.trim() === '') {
        this.productValue = ''
        return
      }

      validated = validated[0].toUpperCase() + validated.slice(1)
      this.productValue = validated
    },
    handleExceed() {

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

</style>

<style>
  .upload-demo-2 .el-upload {
    background-color: rgba(0,0,0,0);
    border: none;
  }

  .upload-demo-2 .el-upload .el-icon-plus {
    display: none;
  }
</style>
