import Vue from 'vue'
import Vuex from 'vuex'

//import module section
import auth from './stores/auth.js'
import outlet from './stores/outlet.js'
import courier from './stores/courier.js'

Vue.use(Vuex)

//define root store vuex
const store = new Vuex.Store({
    //semua modul yang dibuat ditempatkan di dalam bagian ini
    modules: {
        auth, outlet, courier
    },
    //state sama dengan properti data dari component hanya saja dapat digunakan
    //secara global
    state: {
        //variabel token mengambil value dari local storage token
        token: localStorage.getItem('token'),
        errors: []
    },
    //getters
    getters: {
        //membuat getters deng
        isAuth: state => {
            return state.token !== "null" && state.token != null
        }
    },
    mutations: {
        //mutasi untuk berfungsi untuk memanipulasi value dari state token
        SET_TOKEN(state, payload){
            state.token = payload
        },
        SET_ERRORS(state, payload){
            state.errors = payload
        },
        CLEAR_ERRORS(state){
            state.errors = []
        }
    }
})

export default store
