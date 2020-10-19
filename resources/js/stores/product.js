import $axios from "../api.js"

const state = () => ({
    products: [], //state yang akan menyimpan data produk
    page: 1,
});

const mutations = {
    //mutation untuk memasukkan data ke dalam state products
    ASSIGN_DATA(state, payload){
        state.products = payload
    },
    //mutation untuk mengubah value dari state page
    SET_PAGE(state, payload){
        state.page = payload
    }
}

const actions = {
    //fungsi untuk mengambil data ke server
    getProducts({commit, state}, payload)
    {
        let search = typeof payload != 'undefined' ? payload : ''
        return new Promise((resolve, reject) => {
            $axios.get(`/products?=page${state.page}&q=${search}`)
                .then((response) => {
                    //apabila mendapatkan response, data akan dicommit ke mutation ASSIGN_DATA
                    commit('ASSIGN_DATA', response.data)
                    resolve(response.data)
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
