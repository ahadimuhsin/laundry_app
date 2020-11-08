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

//onlyInt
import onlyInt from 'vue-input-only-number'


Vue.use(VueSweetalert2)
Vue.use(BootstrapVue)
Vue.use(onlyInt)
Vue.mixin(Permissions)

import { mapActions, mapGetters, mapState } from 'vuex'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import 'bootstrap-vue/dist/bootstrap-vue.css'
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    computed: {
        ...mapGetters(['isAuth']),
        ...mapState(['token']),
        ...mapState('user', {
            user_authenticated: state => state.authenticated //mengambil state user yang sedang login
        })
    },
    methods: {
        ...mapActions('user', ['getUserLogin']),
        ...mapActions('notification', ['getNotifications']), //fungsi untuk mengambil notifikasi dari tabel notifikasi
        ...mapActions('expenses', ['getExpenses']), //mengambil expenses yg baru

        //untuk inisialisasi laravel echo
        initialLister() {
            //jika user sudah login
            if (this.isAuth) {
                //inisiasi fungsi broadcaster dengan konfigurasi berikut
                window.Echo = new Echo({
                    broadcaster: 'pusher',
                    key: process.env.MIX_PUSHER_APP_KEY, //diambil dari file .env
                    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
                    encrypted: false,
                    auth: {
                        headers: {
                            Authorization: 'Bearer ' + this.token
                        },
                    },
                });

                if (typeof this.user_authenticated.id != 'undefined') {
                    //akses channel broadcast secara private
                    window.Echo.private(`App.User.${this.user_authenticated.id}`)
                        .notification(() => {
                        //apabila ditemukan, jalankan kedua fungsi untuk mengambil
                            //data
                            this.getNotifications()
                            this.getExpenses()
                    })
                }
            }
        }
    },

    watch: {
        //ketika value token berubah, maka
        token() {
            this.initialLister() //jalankan fungsi untuk inisialisasi ulang
        },

        //ketika value user yang sedang login berubah
        user_authenticated() {
            this.initialLister() //jalankan fungsi ini lagi
        }
    },
    created(){
        if(this.isAuth){
            this.getUserLogin() //request data yang sedang login
            this.initialLister()
            this.getNotifications()
        }
    }
})
