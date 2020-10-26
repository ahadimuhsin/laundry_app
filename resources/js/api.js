import axios from 'axios'
import store from './store.js'

const $axios = axios.create({
    baseURL: '/api', //request memiliki url yg depannya /api
    headers: {
        // Authorization: localStorage.getItem('token') !== 'null' ? 'Bearer ' + localStorage.getItem('token'): '',
        'Content-Type': 'application/json'
    }
});

//konfigurasi login menggunakan interceptors
$axios.interceptors.request.use(
    function(config){
        const token = store.state.token
        if(token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    function(error){
        return Promise.reject (error);
    }
)

export default $axios;
