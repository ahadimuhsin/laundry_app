// require('./bootstrap');

import Vue from 'vue'
import router from './router.js'
import store from './store.js'
import App from './App.vue'

//import Bootstrap dan SweetAlert
import BootstrapVue from 'bootstrap-vue'
import VueSweetalert2 from "vue-sweetalert2"

//Permission
import Permissions from './mixins/permission.js'

Vue.use(VueSweetalert2)
Vue.use(BootstrapVue)

Vue.mixin(Permissions)

import {mapActions, mapGetters} from 'vuex'
import 'bootstrap-vue/dist/bootstrap-vue.css'
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    computed: {
        ...mapGetters(['isAuth'])
    },
    methods: {
        ...mapActions('user', ['getUserLogin'])
    },
    created(){
        if(this.isAuth){
            this.getUserLogin() //request data yang sedang login
        }
    }
})
