<template>
  <div v-if="product">
      <div class="img-wrap">
        <img :src="'/' + product.image" />
      </div>
      <div class="product-details">
        <h1>{{ product.name }}</h1>
        <h3 class="price">${{ product.price }} + cost of shoes</h3>
      </div>
  </div>
  <div v-else>
    <NotFoundPage />
  </div>
</template>

<script>
import axios from 'axios';
import NotFoundPage from './NotFoundPage.vue';

export default {
  name: "ProductDetailPage",
  components: {
    NotFoundPage
  },
  data() {
    return {
      product: {},
      cartItems: [],
    }
  },
    async created() {
        console.log(`front end id decoded from url is ${this.$route.params.id}`)
        const response = await axios.get(`/api/products/${this.$route.params.id}`);
        console.log(`product returned ${JSON.stringify(response)}`)
        const product = response.data;
        this.product = product;
    }
}
</script>