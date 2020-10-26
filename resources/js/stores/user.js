import $axios from '../api.js'

const state = () => ({
    users: [], //menampung list user
    roles: [], //menampung list role
    permissions: [], //menampung list permission
    role_permission: [], //menampung permission yang dimiliki oleh role
    authenticated: [] //menampung user yang sedang login
})

const mutations = {
    ASSIGN_USER(state, payload){
        state.users = payload
    },

    ASSIGN_ROLES(state, payload){
        state.roles = payload
    },

    ASSIGN_PERMISSION(state, payload){
        state.permissions = payload
    },

    ASSIGN_ROLE_PERMISSION(state, payload){
        state.role_permission = payload
    },

    CLEAR_ROLE_PERMISSION(state, payload){
        state.role_permission = []
    },

    ASSIGN_USER_AUTH(state, payload){
        state.authenticated = payload
    }
}

const actions = {
    //fungsi ini untuk mengambil data user
    getUserLists({commit}){
        return new Promise((resolve, reject) => {
            //kirim permintaan ke backend
            $axios.get('/user-lists')
            .then((response) => {
                //simpan datanya ke state users menggunakan mutations
                commit('ASSIGN_USER', response.data.data)
                resolve(response.data)
            })
        })
    },

    //fungsi ini untuk mengatur role tiap user
    setRoleUser({commit}, payload){
        return new Promise((resolve, reject) => {
            commit('CLEAR_ERRORS', '', {root: true}) //state error dibersihkan
            //kirim permintaan ke backend
            $axios.post(`/set-role-user`, payload)
            .then((response) => {
                resolve(response.data)
            }).catch((error) => {
                //apabila terjadi error validasi, set errornya agar ditampilkan
                if(error.response.status == 422){
                    commit('SET_ERRORS', error.response.data.errors, {root: true})
                }
            })
        })
    },

    //untuk mengambil list roles
    getRoles({commit}){
        return new Promise((resolve, reject) => {
            //kirim permintaan ke backend
            $axios.get(`/roles`)
            .then((response) => {
                //simpan datanya ke state roles
                commit('ASSIGN_ROLES', response.data.data)
                resolve(response.data)
            })
        })
    },

    //mengambil list permission
    getAllPermission({commit}){
        return new Promise((resolve, reject) => {
            //kirim permintaan ke backend
            $axios.get('/permissions')
            .then((response) => {
                //simpan ke state permission
                commit('ASSIGN_PERMISSION', response.data.data)
                resolve(response.data)
            })
        })
    },

    //mengambil permission yang telah dimiliki oleh role tertentu
    getRolePermission({commit}, payload){
        return new Promise((resolve, reject) => {
            commit('CLEAR_ERRORS', '', {root: true}) //bersihkan state errors
            //kirim permintaan ke backend berdasarkan role_id
            $axios.post('/role-permission', {role_id: payload})
            .then((res) => {
                //simpan data ke state role_permission
                commit('ASSIGN_ROLE_PERMISSION', res.data.data)
                resolve(res.data)
            })
        })
    },

    //mengatur permission setiap role yang dipilih
    setRolePermission({commit}, payload){
        return new Promise((resolve, reject) => {
            commit('CLEAR_ERRORS', '', {root: true})
            //kirim permintaan ke backend
            $axios.post('/set-role-permission', payload)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                //apabila terjadi error validasi
                if(error.response.status == 422){
                    //set errornya agar dapat ditampilkan
                    commit('SET_ERRORS', error.response.data.errors, {root: true})
                }
            })
        })
    },

    //mengambil data user yang sedang login
    getUserLogin({commit}){
        return new Promise((resolve, reject) => {
            $axios.get('user-authenticated')
            .then((res) => {
                //simpan data user tersebut
                commit('ASSIGN_USER_AUTH', res.data.data)
                resolve(res.data)
            })
        })
    }
}

export default
{
    namespaced: true,
    state,
    actions,
    mutations
}
