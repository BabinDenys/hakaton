<template>
  <div class="product-item" >

    <div
      class="product-item__img"
      :style="{ 'background-image': `url('${prod.image}')`}"
      @click="openProduct(prod.id)"
    />

    <div class="product-item__name" @click="openProduct(prod.id)">
      {{prod.name}}
    </div>

    <!-- Begin product-info -->
    <div class="product-info" >

      <div class="product-info__volume" >
        {{prod.by_weight ? '1 кг' : '1 шт'}}
      </div>

<!--      <div class="product-info__price" >-->
<!--        {{prod.description}}-->
<!--      </div>-->
    </div>
    <!-- End product-info -->

    <div class="button-container">
      <el-button class="button btn-edit" @click="goToEdit(prod.id)" type="success">Изменить</el-button>
      <el-button class="button btn-delete" @click="dialog(prod)" type="danger">Удалить</el-button>
    </div>

    <el-dialog
      title="Подтверждение действия"
      class="dialog"
      :visible.sync="dialogVisible"
      width="80%">
      <div class="container-for-text">
        <div>Вы точно хотите удалить товар: <b>{{ productForDelete }}</b>?</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Закрыть</el-button>
        <el-button type="danger" @click="deleteProduct()">Удалить</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
  import { Component, Vue } from 'vue-property-decorator';
  import get from 'lodash/get';
  import axios from 'axios'
  import request from '../../../src/utils/request'

  @Component({
    props: ['prod'],
    components: {
    },
  })
  export default class Product extends Vue {
    dialogVisible = false
    productForDelete = ''
    id = {}

    created() {
    }

    dialog(prod) {
      this.id = prod.id
      this.productForDelete = prod.product.name
      this.dialogVisible = true
    }

    minusToBasket(prod){
      App.Basket.minus(prod.id);
    }

    openProduct(id) {
      this.$router.push(`/operator/product/${id}`)
    }

    get isSale() {
      return this.prod.sale && this.prod.sale !== this.prod.price && this.saleType !== 'fav';
    }

    get isSaleFormula() {
      return this.saleType === 'formula';
    }

    get saleData() {
      return get(this.prod, ['sale_props', 'sale_data'], false);
    }

    get saleType() {
      return get(this.prod, ['sale_props', 'sale_type'], '');
    }

    get formulaData() {
      const m = get(this.prod, ['sale_props', 'sale_data', 'm'], 1);
      const n = get(this.prod, ['sale_props', 'sale_data', 'n'], 1);

      return {
        summ: m + n,
        m,
        n,
      };
    }

    get price() {
      if (this.prod.by_weight) {
        return (this.prod.price * this.prod.boxsize).toFixed(2);
      } else {
        return (this.prod.price).toFixed(2);
      };
    }

    get quantity() {
      if(!this.prod.by_weight) {
        return this.prod.quantity + ' шт';
      }

      if(this.prod.quantity < 1) {
        return (this.prod.quantity * 1000).toFixed(0) + ' гр';
      }

      return (this.prod.quantity).toFixed(2) + ' кг';
    }

    goToEdit(id) {
      this.$router.push(`/operator/edit/${id}`)
    }

    deleteProduct() {
      const id = this.id
      this.dialogVisible = false
      this.loading = true

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
            type: 'success'
          })
          this.$emit('updateProductsList')
        })
        .catch((res) => {
          this.loading = false
          this.$message({
            showClose: true,
            message: 'Не получилось удалить товар',
            type: 'error'
          })
        })
    }

  }
</script>

<style lang="scss" scoped>
  .product-item {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 268px;
    padding: 12px 12px 10px;
    margin-right: 12px;
    border-radius: 6px;

    background-color: rgba(230,230,230,.4);
    flex-shrink: 0;

    &__img {
      height: 100px;
      width: 100%;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;

      margin-bottom: 8px;
    }

    &__img_incard {
      height: 80px;
    }
  }

  .am-sale {
    position: absolute;
    top: 3px;
    left: 3px;
  }

  .product-info {
    display: flex;
    margin-top: 4px;
    margin-bottom: 10px;

    &__volume {
      font-size: 12px;
    }

    &__price {
      padding-left: 2px;
      white-space: nowrap;
      font-size: 12px;
    }
  }

  .product-price {
    display: flex;
    flex: 1;
    margin-top: 8px;
    height: 34px;
    align-items: center;

    .product-price__prices {
      display: flex;
      flex-direction: column;

      flex-grow: 1;
    }

    .product-price__price-val {
      color: black;
      font-weight: bold;
      font-size: 16px;

      &_red {
        color: red;
        height: 20px;
      }
    }

    &__sale-container {
      display: inline-block;
      height: 16px;
    }

    &__sale {
      font-size: 12px;
      /* color: $gray-600; */
      text-decoration: line-through;

      &_more, &_formula {
        color: red;
        text-decoration: none;
      }

      &_fav {
        text-decoration: none;
      }
    }

    &__add {
      display: flex;
      align-self: flex-end;
      justify-content: center;
      align-items: center;

      position: relative;
      height: 34px;
      width: 34px;
      background-color: green;
      border-radius: 50%;
    }

    &__basket-icon {
      position: relative;
      top: 2px;

      color: white;
      font-size: 18px;
    }

    &__old-price {
      /* color: $gray-600; */
      font-size: 10px;
      text-decoration-line: line-through;
    }


  }

  .product-incard {
    display: flex;
    flex: 1;
    height: 60px;
    flex-direction: column;
    justify-content: space-between;

    .product-incard__summ {
      color: black;
      font-weight: bold;
      font-size: 16px;

      &.sale{
        color: #E5243F;
      }
    }

    .product-incard__wrapper {
      display: flex;
    }

    .product-incard__count{
      flex-grow: 1;
      white-space: nowrap;
      text-align: center;
      line-height: 34px;
      font-size: 12px;
      color: black;
      font-weight: normal;
    }

    &__icon {
      height: 34px;
      width: 34px;
      background-color: green;
      border-radius: 50%;
      text-align: center;
      line-height: 34px;
      color: #fff;

      display: flex;
      align-self: flex-end;
      justify-content: center;
      align-items: center;

      i {
        position: relative;
        top: 1px;
      }

      &_minus {

      }

      &_plus {

      }
    }

    .product-incard__remove, .product-incard__add {
      height: 34px;
      width: 34px;
      background-color: green;
      border-radius: 50%;
      text-align: center;
      line-height: 34px;
      color: #fff;
      font-size: 20px;
    }
  }

  .sale_type_more {
    display: inline-block;
    position: absolute;
    top: 10px;
    left: 12px;
    background-color: rgba(255,255,255,.8);
    border-radius: 5px;
    padding-right: 5px;
  }

  .btn-delete {
    width: 100%;
    margin-left: 0;
  }

  .button-container {
    width: 100%;

    .button {
      width: 100%;
      margin-bottom: 10px;
    }
  }

  .product-info__balance {
    margin-top: 2px;
    font-size: 12px;
  }
  .product-info__balance-overall {
    margin-top: 2px;
    font-size: 12px;
    margin-bottom: 4px;
  }
  .product-item__name {
    font-size: 16px;
  }
  .product-item__name-medium {
    font-size: 16px;
  }
</style>

