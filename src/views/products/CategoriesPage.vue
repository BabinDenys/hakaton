<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="Категория"
        width="500">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="Действия">
        <template slot-scope="scope">
          <el-button
            :id="scope.row.name"
            size="mini"
            type="danger"
            @click="dialog(scope.$index, scope.row)">Удалить</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        class="pagination"
        layout="prev, pager, next"
        @current-change="pageChange"
        :page-size="pageSize"
        :total="pagination">
      </el-pagination>
    </div>

    <el-dialog
      title="Подтверждение действия"
      class="dialog"
      :visible.sync="dialogVisible"
      width="320px">
      <div class="container-for-text">
        <div>Вы точно хотите удалить категорию:
          <b>{{ categoryForDelete }}</b>?
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Закрыть</el-button>
        <el-button type="danger" @click="handleDelete()">Удалить</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import request from '../../../src/utils/request'

export default {
  name: 'CategoriesPage',
  data() {
    return {
      loading: false,
      dialogVisible: false,
      categoryForDelete: '',
      index: {},
      row: {},
      tableData: [],
      pagination: 0,
      pageSize: 10,
      page: 1,
    }
  },
  mounted() {
    this.loading = true
    this.getCategories()
  },
  methods: {
    getCategories() {
      request({
        url: `/content/categories/?page=${this.page}&page_size=${this.pageSize}`,
        method: 'get',
        headers: {
          Authorization: this.$store.state.user.token,
        },
      })
        .then((res) => {
          this.pagination = res.data.count
          this.tableData = res.data.results
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    pageChange(page) {
      this.page = page
      this.getCategories()
    },
    handleEdit(index, row) {
    },
    dialog(index, row) {
      this.index = index
      this.row = row
      this.categoryForDelete = row.name
      this.dialogVisible = true
    },
    handleDelete() {
      const index = this.index
      const row = this.row
      this.loading = true
      this.dialogVisible = false

      request({
        url: `/content/categories/${row.id}/`,
        method: 'delete',
        headers: {
          Authorization: this.$store.state.user.token,
        },
      })
        .then((res) => {
          this.loading = false
          this.$message({
            showClose: true,
            message: 'Категория удалена',
            type: 'success',
          })
          this.tableData.splice(index, 1)
          if (this.tableData.length === 0) {
            this.page -= 1
          }
          this.getCategories()
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: 'Не получилось удалить категорию',
            type: 'error',
          })
          this.loading = false
        })
    },
  },
}
</script>

<style scoped>
  .pagination {
    text-align: center;
  }
  .name-wrapper {
    overflow: auto;
    word-break: normal;
  }
  /*.name-wrapper span {*/
  /*  overflow: auto;*/
  /*}*/
</style>
