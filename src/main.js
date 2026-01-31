import './main.css'
import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from 'vue-router'
import ProductsPage from '@/components/ProductsPage.vue';
import NavBar from './components/NavBar.vue';
import ProductDetailPage from './components/ProductDetailPage.vue';
import NotFoundPage from './components/NotFoundPage.vue';
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAecELVVX9WyBdr0Y9-KwS2yupJkD7KB4k",
  authDomain: "vue-site1.firebaseapp.com",
  projectId: "vue-site1",
  storageBucket: "vue-site1.firebasestorage.app",
  messagingSenderId: "424117255358",
  appId: "1:424117255358:web:f10d7f41e1f149d1b832ef"
};
initializeApp(firebaseConfig);

createApp(App)
    .use(VueRouter.createRouter({
        history:  VueRouter.createWebHistory(import.meta.env.BASE_URL),
        routes:  [
            {
                path:  '/products',
                component:  ProductsPage
            },
            {
                path:  '/products/:id',
                component:  ProductDetailPage
            },
            {
                path:  '/',
                component:  NavBar
            },
            {
                path:  '/:pathMatch(.*)*',
                component:  NotFoundPage
            }
        /*   {
                path:  '/cart',
                component:  ShoppingCartPage
            },
            {
                path: '/',
                redirect: '/products'
            } */
        ]
    }))
    .mount('#app');
