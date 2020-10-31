import $axios from '../api.js'

//definisi state
const state = () => ({
    expenses: [],
    page: 1,
})

const mutations = {
    //assign data expenses yang didapatkan ke dalam state
    ASSIGN_DATA(state, payload) {
        state.expenses = payload
    },

    //set page yang aktif ke dalam state page
    SET_PAGE(state, payload) {
        state.page = payload
    }
}

//method yang akan dijalankan di page expenses
const actions = {
    //request ke API untuk mengambil data expenses
    getExpenses({ commit, state }, payload) {
        let search = typeof payload != 'undefined' ? payload : ''
        return new Promise((resolve, reject) => {
            //request ke backend
            $axios.get(`/expenses?page=${state.page}=${search}`)
                .then((response) => {
                //ketika responsenya berhasil, commit data tersebut ke dalam state
                    commit('ASSIGN_DATA', response.data)
                    resolve(response.data)
            })
        })
    },

    submitExpenses({ dispatch, commit }, payload) {
        return new Promise((resolve, reject) => {
            //kirim permintaan untuk menambah data
            $axios.post('/expenses', payload)
                .then((res) => {
                //ambil data yg baru
                    dispatch('getExpenses').then(() => {
                        resolve(res.data)
                    })
                }).catch((error) => {
                //jika validasi error
                    if (error.response.status == 422) {
                        //simpan errornya ke state error
                        commit('SET_ERRORS', error.response.data.errors, {root: true})
                    }
            })
        })
    },

    //mengambil data untuk diedit
    editExpenses({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //mengirimkan permintaan ke backend untuk mengambil data berdasrkan ID
            $axios.get(`/expenses/${payload}/edit`)
                .then((response) => {
                resolve(response.data)
            })
        })
    },

    //mengupdate data
    updateExpenses({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //request ke backend untuk menjalankan proses update
            $axios.put(`/expenses/${payload.id}`, payload)
                .then((response) => {
                resolve(response.data)
            })
        })
    },

    //terima expense
    acceptExpenses({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //kirim permintaan ke server untuk mengubah value menjadi accept
            $axios.post(`expenses/accept`, { id: payload })
                .then((response) => {
                resolve(response.data)
            })
        })
    },

    //tolak expense
    cancelExpenses({ commit }, payload) {
        return new Promise((resolve, reject) => {
            //kirim permintaan ke server untuk mengubah value menjadi tolak
            $axios.post('/expenses/cancel', payload)
                .then((response) => {
                resolve(response.data)
            })
        })
    },

    removeExpenses({ dispatch }, payload) {
        return new Promise((resolve, reject) => {
            //kirim permintaan untuk menghapus berdasarkan ID
            $axios.delete(`expenses/${payload}`)
                .then((response) => {
                dispatch('getExpenses').then(() => resolve(response.data))
            })
        })
    }
}


export default {
    namespaced: true,
    actions,
    mutations,
    state
}
