import $axios from '../api.js'

const state = () => ({
    outlets: [], //untuk menampung data outlet dari database

    //untuk menampung form input
    outlet: {
        code: '',
        name: '',
        status: 0,
        address: '',
        phone: ''
    },
    page: 1 //mencatat page paginate yang sedang diakses
})

const mutations = {
    //memasukkan data ke state outlet
    ASSIGN_DATA(state, payload){
        state.outlets = payload
    },

    //mengubah data state page
    SET_PAGE(state, payload){
        state.page = payload
    },

    //mengubah data state outle
    ASSIGN_FORM(state, payload){
        state.outlet = {
            code: payload.code,
            name: payload.name,
            status: payload.status,
            address: payload.address,
            phone: payload.phone
        }
    },
    //mereset state outlet menjadi kosong
    CLEAR_FORM(state){
        state.outlet = {
            code: '',
            name: '',
            status: false,
            address: '',
            phone: ''
        }
    }
}

const actions = {
    //merequest data outlet dari server
    getOutlets({commit, state}, payload) {
        //mengecek apakah ada payload atau tidak
        let search = typeof payload != 'undefined' ? payload : ''
        return new Promise((resolve, reject) => {
            //request data dengan endpoint /outlets
            $axios.get(`outlets?page=${state.page}&q=${search}`)
                .then((response) => {
                    //simpan data ke state melalui mutations
                    commit('ASSIGN_DATA', response.data)
                    resolve(response.data)
                })
        })
    },

    //menambah data baru
    submitOutlet({dispatch, commit, state}){
        return new Promise ((resolve, reject) => {
            //mengirimkan permintaan ke server dan melampirkan data yang
            //akan disimpan dari state outlet
            $axios.post('/outlets', state.outlet)
                .then((response) => {
                    //apabila berhasil, lakukan request lagi untuk mengambil
                    //data terbaru
                    dispatch('getOutlets').then(() => {
                        resolve(response.data)
                    })
                }).catch((error) => {
                    //apabila terjadi error validasi, kirim kode 422
                if(error.response.status === 422){
                    //list error akan diassign ke state errors
                    commit('SET_ERRORS', error.response.data.errors, {root: true})
                }
            })
        })
    },

    //untuk proses edit, ambil data berdasarkan id yg diminta
    editOutlet({commit}, payload){
        return new Promise((resolve, reject) => {
            //melakukan request dengan mengirimkan kode outlet di url
            $axios.get(`/outlets/${payload}/edit`)
                .then((response) => {
                    //apabila berhasil, assign ke form
                    commit('ASSIGN_FORM', response.data.data)
                    resolve(response.data)
                })
        })
    },

    //proses update data
    updateOutlet({state, commit}, payload){
        return new Promise((resolve, reject) => {
            //lakukan request dengan mengirimkan kode di url
            //dan kirimkan data terbaru yang telah diedit
            //melalui state outlet
            $axios.put(`/outlets/${payload}`, state.outlet)
                .then((response) =>{
                    //bersihkan form
                    commit('CLEAR_FORM')
                    resolve(response.data)
                })
        })
    },

    //hapus data
    removeOutlet({dispatch}, payload){
        return new Promise((resolve, reject) => {
            //kirimkan permintaan ke server untuk menghapus data
            //dengan metode delete dan id outlet
            $axios.delete(`/outlets/${payload}`)
                .then((response) => {
                    //apabila berhasil, fetch data terbaru dari server
                    dispatch('getOutlets').then(()=> resolve())
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

