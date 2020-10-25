import $axios from "../api.js"

const state = () => ({
    products: [], //state yang akan menyimpan data produk
    page: 1,
    laundry_types:[],
});

const mutations = {
    //mutation untuk memasukkan data ke dalam state products
    ASSIGN_DATA(state, payload){
        state.products = payload
    },
    //mutation untuk mengubah value dari state page
    SET_PAGE(state, payload){
        state.page = payload
    },
    ASSIGN_LAUNDRY_TYPE(state, payload) {
        state.laundry_types = payload
    }
}

const actions = {
    //fungsi untuk mengambil data ke server
    getProducts({commit, state}, payload)
    {
        let search = typeof payload != 'undefined' ? payload : ''
        return new Promise((resolve, reject) => {
            $axios.get(`/product?=page${state.page}&q=${search}`)
                .then((response) => {
                    //apabila mendapatkan response, data akan dicommit ke mutation ASSIGN_DATA
                    commit('ASSIGN_DATA', response.data)
                    resolve(response.data)
                })
        })
    },

    //mengambil tipe laundry
    getLaundryType({ commit }) {
        return new Promise((resolve, reject) => {
            //mengirim request untuk mengambil data laundry type
            $axios.get('/product/laundry-type')
                .then((response) => {
                commit('ASSIGN_LAUNDRY_TYPE', response.data.data)
            })
        })
    },

    //menambah data tipe laundry
    addLaundryType({ commit }, payload) {
        return new Promise((resolve, reject) => {
            $axios.post('product/laundry-type', payload)
                .then((response) => {
                resolve(response.data)
                })
                .catch((error) => {
                //jika terjadi error validasi, errornya disimpan ke dalam
                    //variabel errors
                    if (error.response.status == 422) {
                        commit('SET_ERRORS', error.response.data.errors, {root: true})
                    }
            })
        })
    },

    //menambah produk laundry
    addProductLaundry({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //mengirim request untuk menambah produk baru
            $axios.post('/product', payload)
                .then((response) => {
                resolve(response.data)
                })
                .catch((error) => {
                //jika ada error
                    if (error.response.status == 422) {
                        commit('SET_ERRORS', error.response.data.errors, {root:true})
                    }
            })
        })
    },

    //mengubah data product
    editProduct({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //mengirim request untuk mengambil data product berdasarkan ID
            $axios.get(`/product/${payload}/edit`)
                .then((response) => {
                resolve(response.data)
            })
        })
    },

    //mengubah data kurir
    updateProduct({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //mengirim request untuk mengubag data product
            $axios.put(`/product/${payload.id}`, payload)
                .then((response) => {

                    resolve(response.data)
                })
                .catch((error) => {
                //set error validasi
                    if (error.response.status == 422) {
                        commit('SET_ERRORS', error.response.data.errors, {root:true})
                    }
            })

        })
    },

    //hapus product
    removeProduct({ dispatch }, payload) {
        return new Promise((resolve, reject) => {
            //mengirim permintaan hapus data produk berdasarkan ID
            $axios.delete(`/product/${payload}`)
                .then((response) => {
                dispatch('getProducts').then(() => resolve(response.data))
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
