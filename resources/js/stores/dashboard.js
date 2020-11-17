import $axios from '../api'

const state = () => ({
    transactions: [] //menampung data transaksi
})

const mutations = {
    //untuk memanipulasi data state transaksi
    ASSIGN_DATA_TRANSACTION(state, payload){
        state.transactions = payload
    }
}

const actions = {
    //action untuk meng-handle request ke server
    getChartData({commit}, payload){
        return new Promise((resolve, reject) => {
            //minta data chart transaksi ke server berdasarkan bulan dan tahun
            $axios.get(`chart?month=${payload.month}&year=${payload.year}`)
            .then((response)=> {
                //kirim datanya ke mutasi untuk disimpan ke dalam state
                commit('ASSIGN_DATA_TRANSACTION', response.data)
                resolve(response.data)
            } )
        })
    }
}

export default
{
    namespaced: true,
    actions,
    mutations,
    state
}
