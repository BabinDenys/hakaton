<template>
  <div class="page">
    <component
      :is="component"
      :id="idForProp"
      :index="indexForProp"
      @exit="exit"
      @goToProduct="goToProduct"
      @changeToEdit="changeToEdit"
      @deleteProduct="dialog"
      @updateTable="updateTable"
    />

    <div class="search">
      <el-select v-model="categoryValue" class="search-field" placeholder="Категория">
        <el-option
          v-for="item in categoryOptions"
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
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.by_weight">Весовой</span>
              <span v-if="!scope.row.by_weight">Не весовой</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Просмотр товара"
          >
            <template slot-scope="scope">
              <el-button
                :id="getId(scope, 1)"
                size="mini"
                @click="openProduct(scope.$index, scope.row)"
              >Просмотр</el-button>
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
      width="320px"
    >
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
</template>

<script>
import request from '../../../src/utils/request'
import Popup from '../../../src/components/Popup/index'
import PopupEdit from '../../../src/components/Popup/edit'
import store from '@/store'

export default {
  components: {
    Popup,
    PopupEdit,
  },
  data() {
    return {
      component: null,
      idForProp: '',
      indexForProp: '',
      showProduct: false,
      loading: false,
      products: [],
      dialogVisible: false,
      productForDelete: '',
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
    updateTable() {
      this.getData(this.page)
    },
    exit() {
      setTimeout(() => {
        this.component = null
        store.dispatch('popup/noPopup')
      }, 1000)

    },
    goToProduct() {
      this.component = Popup
    },
    changeToEdit() {
      this.component = PopupEdit
    },
    getData(page) {
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
        })
        .catch(() => {
          this.loading = false
          this.isLoading = true
        })
    },
    getClass(scope) {
      // return scope.row.name + '-' + scope.rowIndex
      return scope.row.name
    },
    getId(scope, info) {
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
    openProduct(index, row) {
      this.idForProp = row.id
      this.indexForProp = index
      this.component = Popup
      // this.$router.push(`/operator/product/${id}`)
    },
    goToEdit(row) {
      const id = row.id
      this.$router.push(`/operator/edit/${id}`)
    },
    dialog(name) {
      console.log(name)
      this.productForDelete = name
      this.dialogVisible = true
    },
    deleteProduct() {
      this.dialogVisible = false

      request({
        url: `/content/products/${this.idForProp}/`,
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
          this.component = null
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

</style>
