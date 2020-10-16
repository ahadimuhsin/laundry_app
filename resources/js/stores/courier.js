import $axios from '../api.js'

const state = () => ({
    couriers: [], //menampung data kurir
    page: 1, //page aktif
    id: '', //digunaan saat edit data nanti
});

const mutations = {
    //memasukkan data ke dalam state kurir
    ASSIGN_DATA(state,payload){
        state.couriers = payload
    },

    //mengubah state page
    SET_PAGE(state, payload)
    {
        state.page = payload
    },

    //mengubah state id
    SET_ID_UPDATE(state, payload)
    {
        state.id = payload
    }
}

const actions = {
    ////melakukan request ke server untuk mengambil data
    getCouriers ({commit, state}, payload){
        let search = typeof payload != 'undefined' ? payload : ''
        return new Promise((resolve, reject) => {
            //dengan menggunakan method get
            $axios.get(`couriers?page=${state.page}&q=${search}`)
            .then((response) => {
                //commit untuk melakukan perubahan data
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