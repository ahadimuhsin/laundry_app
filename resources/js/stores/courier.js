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
            $axios.get(`/couriers?page=${state.page}&q=${search}`)
            .then((response) => {
                //commit untuk melakukan perubahan data
                commit('ASSIGN_DATA', response.data)
                resolve(response.data)
            })
        })
    },
    //proses memasukkan data kurir
    submitCourier({ dispatch, commit }, payload)
    {
        return new Promise((resolve, reject) => {
            //mengirim permintaan ke server dengan method post
            $axios.post(`/couriers`, payload, {
                //karena terdapat file yang dikirimkan, headernya ditambahkan multipart/form-data
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((response) => {
                //ketika berhasil, melakukan request untuk mendapatkan data kurir terbaru
                    dispatch('getCouriers').then(() => {
                        resolve(response.data)
                    })
                })
                .catch((error) => {
                //jika gagal, akan memunculkan error validasi
                    if(error.response.status == 422)
                    {
                        commit('SET_ERRORS', error.response.data.errors, {root:true})
                    }
            })
        })
    },
    //proses mengambil data kurir yang ingin diedit
    editCourier({ commit }, payload)
    {
        return new Promise((resolve, reject) => {
            //melakukan request single data berdasarkan ID kurir dari backend
            $axios.get(`/couriers/${payload}/edit`)
                .then((response) => {
                //data yang diterima akan dikirimkan ke form
                    resolve(response.data)
            })
        })
    },
    //proses update data kurir
    updateCourier({ state }, payload)
    {
        return new Promise((resolve, reject) => {
            //melakukan request perubahan data kurir berdasarkan ID
            $axios.post(`/couriers/${state.id}`, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((response) => {
                resolve(response.data)
            })
        })
    },

    //proses hapus data kurir
    removeCourier({ dispatch }, payload)
    {
        return new Promise((resolve, reject) => {
            //merequest ke server dengan method delete
            $axios.delete(`couriers/${payload}`)
                .then((response) => {
                //mengambil data terbaru dari server
                    dispatch('getCouriers').then(() => resolve(response.data))
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
