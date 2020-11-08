import { reject } from 'lodash'
import $axios from '../api'

const state = () => ({
    customers: [], //inisiasi state customer

    //state untuk form add dan edit
    customer: {
        nik: '',
        name: '',
        address: '',
        phone: ''
    },
    page: 1
})

const mutations = {
    ASSIGN_DATA(state, payload){
        state.customers = payload
    },

    //mengubah state page
    SET_PAGE(state, payload){
        state.page = payload
    },

    //mengubah state customer
    ASSIGN_FORM(state, payload){
        state.customer = payload
    },

    //reset state customer
    CLEAR_FORM(state){
        state.customer = {
            nik: '',
            name: '',
            address: '',
            phone: ''
        }
    }
}

const actions = {
    getCustomers({commit, state}, payload){
        let search = typeof payload != 'undefined' ? payload : ''
        return new Promise((resolve, reject) => {
            //request data customer
            $axios.get(`/customer?page=${state.page}&q=${search}`)
            .then((response) => {
                commit('ASSIGN_DATA', response.data) // jika data diterima, simpan ke dalam mutations
                resolve(response.data)
            })
        })
    },

    submitCustomer({dispatch, commit, state}){
        return new Promise((resolve, reject) => {
            //mengirim request ke backend
            $axios.post(`/customer`, state.customer)
            .then((response) => {
                //apabila berhasil maka load data customer
                dispatch('getCustomers').then(() => {
                    resolve(response.data)
                })
            })
            .catch((error) => {
                //jika terjadi error validasi
                if(error.response.status == 422){
                    commit('SET_ERRORS', error.response.data.errors, {root: true})
                }
            })
        })
    },

    //ambil data berdasarkan ID
    editCustomer({commit}, payload){
        return new Promise((resolve, reject) => {
            $axios.get(`/customer/${payload}/edit`)
            .then((response) => {
                commit('ASSIGN_FORM', response.data.data)
                resolve(response.data)
            })
        })
    },
    //updateCustomer
    updateCustomer({state, commit}, payload){
        return new Promise((resolve, reject) => {
            $axios.put(`/customer/${payload}`, state.customer)
            .then((response) => {
                commit('CLEAR_FORM')
                resolve(response.data)
            })
        })
    },

    //hapus customer
    removeCustomer({dispatch}, payload){
        return new Promise((resolve, reject) => {
            $axios.delete(`/customer/${payload}`)
            .then((response) => {
                dispatch('getCustomers').then(() => resolve())
            })
        })
    }
}

export default
{
    namespaced: true,
    state,
    mutations,
    actions
}
