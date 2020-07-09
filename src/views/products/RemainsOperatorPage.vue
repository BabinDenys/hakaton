<template>
  <div class="page">
    <div class="search">
      <el-select v-model="categoryValue" class="search-field" placeholder="Категория" @change="getProducts()">
        <el-option
          v-for="item in categoryOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-select v-model="productValue" class="search-field" :disabled="!categoryValue" placeholder="Товар">
        <el-option
          v-for="item in productOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-select v-model="farmerValue" class="search-field" placeholder="Фермер">
        <el-option
          v-for="item in farmerOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-select v-model="typeValue" class="search-field" placeholder="Тип">
        <el-option
          v-for="item in typeOptions"
          :key="item.name"
          :label="item.name"
          :value="item.value"
        />
      </el-select>

      <el-input v-model="productNameValue" class="search-input search-field" placeholder="Название товара" />

      <el-button class="search-field" type="success" @click="getData(1)">Поиск</el-button>
      <el-button class="search-field" type="danger" @click="clearSearchFields()">Сбросить фильтры</el-button>

    </div>

    <div v-if="products.length === 0 && isLoading" class="page-container">
      <div class="text">Нет данных</div>
    </div>

    <div v-else class="page-container">

      <template>
        <el-table
          :data="products"
          style="width: 100%"
          :row-class-name="getClass"
        >
          <el-table-column
            label="Фермер"
            width="180"
          >
            <template>
              <span>Инфо фермера</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Категория"
            width="180"
          >
            <template slot-scope="scope">
              <div class="container-word-break">
                <span>{{ scope.row.category }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="Название"
            width="180"
          >
            <template slot-scope="scope">
              <div class="container-word-break">
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="Тип товара"
            width="180"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.by_weight">Весовой</span>
              <span v-if="!scope.row.by_weight">Не весовой</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Цена"
            width="180"
          >
            <template>
              <el-input v-model="price" style="width: 100px" /> ₽
            </template>
          </el-table-column>
          <el-table-column
            label="Остатки"
            width="180"
          >
            <template>
              <el-input v-model="weight" />
            </template>
          </el-table-column>
          <el-table-column
            label="Добавить в выгрузку"
            width="180"
          >
            <template>
              <div class="table-checkbox">
                <el-checkbox v-model="checked" />
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="block">
          <el-pagination
            class="pagination"
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="pagination"
            @current-change="pageChange"
          />
        </div>
      </template>
    </div>

    <el-dialog
      title="Подтверждение действия"
      class="dialog"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <span>Вы точно хотите удалить товар: <b>{{ productForDelete }}</b>?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Закрыть</el-button>
        <el-button type="danger" @click="deleteProduct()">Удалить</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '../../../src/utils/baseUrl'

export default {
  name: 'RemainsOperatorPage',
  components: {
  },
  data() {
    return {
      weight: '',
      price: '',
      loading: false,
      productValue: '',
      products: [],
      productOptions: [],
      farmerValue: '',
      farmerOptions: [],
      dialogVisible: false,
      id: '',
      isLoading: false,
      pagination: 0,
      pageSize: 10,
      page: 1,
      categoryAll: [{
        id: '',
        name: 'Все категории',
      }],
      categoryOptions: [],
      categoryValue: '',
      typeValue: '',
      rowForDelete: null,
      productNameValue: '',
      typeOptions: [
        {
          name: 'Весовой',
          value: true,
        },
        {
          name: 'Не весовой',
          value: false,
        },
        {
          name: 'Все',
          value: '',
        },
      ],
    }
  },
  mounted() {
    this.getData(this.page)
    this.getCategories()
  },
  methods: {
    getData(page) {
      console.log(this.typeValue)
      console.log(this.categoryValue)
      this.loading = true

      request({
        url: `/content/products/`,
        method: 'get',
        headers: {
          Authorization: this.$store.state.user.token,
        },
        params: {
          page: page,
          page_size: this.pageSize,
          by_weight: this.typeValue,
          category: this.categoryValue,
          search: this.productNameValue,
        },
      })
        .then((res) => {
          this.pagination = res.data.count
          this.products = res.data.results
          this.loading = false
          this.isLoading = true
          console.log(this.isLoading)
          console.log(!!this.products)
        })
        .catch(() => {
          this.loading = false
          this.isLoading = true
        })
    },
    getClass(scope) {
      console.log(scope.row)
      console.log(scope.rowIndex)
      // return scope.row.name + '-' + scope.rowIndex
      return scope.row.name
    },
    getId(scope, info) {
      console.log(scope)
      let name = ''
      if (info === 1) {
        name = '_Просмотр'
      } else if (info === 2) {
        name = '_Изменить'
      } else if (info === 3) {
        name = '_Удалить'
      }

      // return scope.row.name + '-' + scope.$index + name
      return scope.row.name + name
    },
    clearSearchFields() {
      this.categoryValue = ''
      this.typeValue = ''
      this.productNameValue = ''
      this.getData(1)
    },
    getProducts() {
      request({
        url: `/content/products/by_category/${this.categoryValue}`,
        method: 'get',
        headers: {
          Authorization: this.$store.state.user.token,
        },
      })
        .then((res) => {
          this.productOptions = res.data
          this.productValue = ''
        })
        .catch(() => {
        })
    },
    getCategories() {
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
          this.categoryOptions = this.categoryAll.concat(res.data.results)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    pageChange(page) {
      this.page = page
      this.getData(page)
    },
    openProduct(row) {
      const id = row.id
      this.$router.push(`/operator/product/${id}`)
    },
    goToEdit(row) {
      const id = row.id
      this.$router.push(`/operator/edit/${id}`)
    },
    dialog(index, prod) {
      console.log(index)
      console.log(prod)
      this.rowForDelete = index
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
          this.products.splice(this.rowForDelete, 1)
          if (this.products.length === 0) {
            this.page -= 1
          }
          this.getData(this.page)
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

  .products-list {
    display: flex;
    flex-wrap: wrap;
  }

  .products-item {
    width: 50%;
    padding: 4px;
  }

  .text {
    text-align: center;
  }

  .pagination {
    text-align: center;
  }

  .search-input {
    width: 250px;
  }

  .search-field {
    margin: 20px 0 0 20px;
  }

  .table-checkbox {
    display: flex;
    justify-content: center;
  }

</style>
