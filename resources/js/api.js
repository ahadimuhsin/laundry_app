import axios from 'axios'

const $axios = axios.create({
    baseURL: '/api', //request memiliki url yg depannya /api
    headers: {
        Authorization: localStorage.getItem('token') !== 'null' ? 'Bearer ' + localStorage.getItem('token'): '',
        'Content-Type': 'application/json'
    }
});

export default $axios;
