import $axios from '../api'

const state = () => ({
    customers: [],
    products: [],
    transaction: [],
    page: 1
})

const mutations = {
    //mengubah state customer berdasarkan data yg diterima
    ASSIGN_DATA(state, payload){
        state.customers = payload
    },
    //mengubah state product berdasarkan data yang diterima
    DATA_PRODUCT(state, payload){
        state.products = payload
    },

    SET_PAGE(state, payload){
        state.page = payload
    },
    //mutasi transaksi
    ASSIGN_TRANSACTION(state, payload){
        state.transaction = payload
    },
}

const actions = {
    //mengirim permintaan ke server untuk mengambil data customer
    //berdasarkan keyword
    getCustomers({commit, state}, payload){
        let search = payload.search
        payload.loading(true)
        return new Promise((resolve, reject) => {
            $axios.get(`/customer?page=${state.page}&q=${search}`)
            .then((response) => {
                //jika berhasil, simpan data ke state
                commit('ASSIGN_DATA', response.data)
                payload.loading(false)
                resolve(response.data)
            })
        })
    },
    //mengirim permintaan ke server untuk mengambil data product
    //berdasarkan keyword
    getProducts({commit, state}, payload){
        let search = payload.search
        payload.loading(true)
        return new Promise((resolve, reject) => {
            $axios.get(`/product?page=${state.page}&q=${search}`)
            .then((response) => {
                //jika berhasil, simpan data ke state
                commit('DATA_PRODUCT', response.data)
                payload.loading(false)
                resolve(response.data)
            })
        })
    },

    //membuat transaksi
    createTransaction({commit}, payload){
        return new Promise((resolve, reject) => {
            //mengirim permintaan ke server untuk membuat transaksi
            $axios.post(`/transaction`, payload)
            .then((response) => {
                resolve(response.data)
            })
        })
    },

    // Mengambil data detail Transaksi
    detailTransaction({commit}, payload){
        return new Promise((resolve, reject) => {
            $axios.get(`/transaction/${payload}/edit`)
            .then((response) => {
                //commit ke ASSIGN_TRANSACTION
                commit('ASSIGN_TRANSACTION', response.data.data)
                resolve(response.data)
            })
        })
    },

    // Mengirim data yang sudah diklik complete
    completeItem({commit}, payload){
        return new Promise((resolve, reject) => {
            $axios.post(`/transaction/complete-item`, payload)
            .then((response) => {
                resolve(response.data)
            })
        })
    },

    //menghandle proses pembayaran
    payment({commit}, payload){
        return new Promise((resolve, reject) => {
            $axios.post(`/transaction/payment`, payload)
            .then((response) =>{
                resolve(response.data)
            })
        })
    }
}

export default{
    namespaced: true,
    state,
    actions,
    mutations
}
