import $axios from '../api.js'

const state = () => ({

})

const mutations = {

}

const actions = {
    submit({commit}, payload){
        localStorage.setItem('token', null) //reset local storage menjadi null
        commit('SET_TOKEN', null, {root:true}) //reset state token menjadi null
        //karena mutations set_token berada pada root stores, maka tambahkan parameter
        //root true

        //gunakan promise agar fungsi selanjutnya berjalan ketika
        //fungsi ini selesai
        return new Promise((resolve, reject) => {
            //mengirim request ke server dengan URI /login
            //payload adalah data yang dikirimkan dari komponen
            //login.vue
            $axios.post('/login', payload)
                .then((response) => {
                    //jika sukses
                    if(response.data.status == 'success'){
                        //set localstorage dan state token menggunakan
                        //api dari server response
                        localStorage.setItem('token', response.data.data)
                        commit('SET_TOKEN', response.data.data, {root: true})
                    }else{
                        commit('SET_ERRORS', {invalid: 'Email/Password Salah'}, {root: true})
                    }
                    //lakukan resolve agar dianggap selesai
                    resolve(response.data)
                })
                .catch((error) => {
                    if(error.response.status === 422){
                        commit('SET_ERRORS', response.data.errors, {root:true})
                    }
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
