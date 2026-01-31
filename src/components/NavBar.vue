<template>
<div class="grid-wrap">
    <div class="nav-bar">
        <router-link to="/products" class="home-link">
            <div class="logo-wrap">
                Sam's Designs
                <img class="logo-wrap" :src="logo"/>
            </div>
        </router-link>
        <div class="nav-buttons-wrap">
            <button class="sign-in" @click="signIn" v-if="!user">Sign In</button>
            <button class="navbar-button" @click="signOut" v-if="user">Sign Out</button>
        </div>
    </div>
</div>
</template>

<script>
//import { getAuth, signOut } from 'firebase/auth';
//const __dirname = import.meta.dirname;
import logo from '@/assets/logo.png';
export default {
  name: "NavBar",
  props: ['user'],
  data() {
    return {
      logo,
    }
  },
  methods: {
    async signIn() {
      const email = prompt('Please enter your email to sign in:');
      const auth = getAuth();
      const actionCodeSettings = {
        url: `https://tls-vue-olive-oils-shopping-cart.onrender.com/products/${this.$route.params.id}`,
        handleCodeInApp: true,
      }
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      alert('A login link was sent to the email you provided');
      window.localStorage.setItem('emailForSignIn', email);
    },
    signOut() {
      const auth = getAuth();
      signOut(auth);
    }
  }
}
</script>