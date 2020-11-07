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
                commit('ASSIGN_DATA', resonse.data) // jika data diterima, simpan ke dalam mutations
                resolve(response.data)
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
