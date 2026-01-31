<template>
    <h1>Product Samples</h1>
    <ProductsList :products="products"/>
</template>

<script>
import axios from 'axios'
import ProductsList from '@/components/ProductsList.vue';

export default {
  name: "ProductsPage",
  props: ['user'],
  components: {
    ProductsList
  },
  data() {
    return {
      products: [],
    }
  },
  async created() {
    const response = await axios.get('/api/products');
    const products = response.data;
    this.products = products;
    console.log(`axios get api/products result:  ${JSON.stringify(this.products)}`)
  }
}
</script>