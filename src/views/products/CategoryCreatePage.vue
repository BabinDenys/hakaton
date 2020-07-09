<template>
  <div class="page">

    <div class="page-container">

      <div class="block">
        <p>Название новой категории</p>
        <el-input v-model="categoryName" placeholder="Название новой категории" class="category-input" @input="changedInput" />
      </div>

      <el-button type="success" @click="addCategory()">Создать Категорию</el-button>

    </div>
  </div>
</template>

<script>
import request from '../../../src/utils/request'

export default {
  data() {
    return {
      loading: false,
      categoryName: '',
      validatedCategoryName: '',
      validCategory: {
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
  },
  methods: {
    addCategory() {
      this.loading = true
      this.validatedCategoryName = this.categoryName.replace(/ +/g, ' ').trim().toLowerCase()
      this.validatedCategoryName = this.validatedCategoryName[0].toUpperCase() + this.validatedCategoryName.slice(1)

      request({
        url: `/content/categories/`,
        method: 'post',
        headers: {
          Authorization: this.$store.state.user.token,
        },
        data: {
          name: this.validatedCategoryName,
        },
      })
        .then(() => {
          this.loading = false
          this.$message({
            showClose: true,
            message: 'Категория добавлена',
            type: 'success',
          })
          this.categoryName = ''
        })
        .catch((res) => {
          this.loading = false
          this.$message({
            showClose: true,
            message: 'Не получилось добавить категорию',
            type: 'error',
          })
        })
    },
    changedInput() {
      let validated = this.categoryName.replace(/ +/g, ' ').trimStart()

      if (validated.trim() === '') {
        this.categoryName = ''
        return
      }

      validated = validated[0].toUpperCase() + validated.slice(1)
      this.categoryName = validated
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
  .category-input {
    width: 350px;
  }

</style>
