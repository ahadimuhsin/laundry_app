import $axios from '../api.js'

const state = () => ({
    notifications: [] //menampung state notifications
})

const mutations = {
    //assign_data
    ASSIGN_DATA(state, payload) {
        state.notifications = payload
    }
}

const actions = {
    getNotifications({ commit }) {
        return new Promise((resolve, reject) => {
            //request ke server untuk mengambil notifikasi
            $axios.get('/notification')
                .then((response) => {
                //data yang diterima, dicommit ke mutasi assign_data
                    commit('ASSIGN_DATA', response.data.data)
                    resolve(response.data)
            })
        })
    },

    readNotification({ dispatch }, payload) {
        return new Promise((resolve, reject) => {
            //untuk update data notifikasi bahwa notif tersebut sudah dibaca
            $axios.post('/notification', payload)
                .then((response) => {
                //ambil data notifikasi terbaru
                    dispatch('getNotifications')
                        .then(() => resolve(response.data))
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
