<template>
    <div class="container">

        <div class="login-box">

            <div class="login-logo">
                <router-link :to="{name: 'home'}"><b>Laundryku</b></router-link>
            </div>

            <div class="login-box-body">
                <p class="login-box-msg">Sign in start your session</p>

                <div class="form-group has-feedback" :class="{'has-error' : errors.email}">
                    <input type="email" class="form-control" placeholder="Email" v-model="data.email">
                    <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                    <p class="text-danger" v-if="errors.email">{{errors.email[0]}}</p>
                </div>

                <div class="form-group has-feedback" :class="{'has-error' : errors.password}">
                    <input type="password" class="form-control" placeholder="Password" v-model="data.password">
                    <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                    <p class="text-danger" v-if="errors.password">{{errors.password[0]}}</p>
                </div>

                <div class="alert alert-danger" v-if="errors.invalid">{{errors.invalid}}</div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="custom-checkbox">
                            <label>
                                <input type="checkbox" v-model="data.remember_me">Remember Me
                            </label>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <button type="submit" class="btn btn-primary btn-block btn-flat"
                        @click.prevent="postLogin">Login
                        </button>
                    </div>
                </div>

                <a href="#">I Forgot My Password</a>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapMutations, mapGetters, mapState} from 'vuex';
export default {
    // name: "Login"
    data(){
        return {
            data: {
                email: '',
                password: '',
                remember_me : false
            }
        }
    },
    //sebelum component dirender
    created() {
        //lakukan pengecekan jika sudah login, value is Auth bernilai true
        if(this.isAuth){
            //redirect ke route home
            this.$router.push({
                name: 'home'
            })
        }
    },
    computed: {
        ...mapGetters(['isAuth']), //mengambil getters isAuth dari vuex
        ...mapState(['errors'])
    },
    methods: {
        ...mapActions('auth', ['submit']), //mengisiasi funsgi submit dari Vuex
        ...mapActions('user', ['getUserLogin']), //menjalankan method ambil data user login
        ...mapMutations(['CLEAR_ERRORS']),

        //ketika tombol login ditekan, akan jalan postLogin
        postLogin(){
            //fungsi ini menjalankan fungsi submit dengan mengirimkan data yang dibutuhkan
            this.submit(this.data).then(() => {
                //cek value isAuth
                if(this.isAuth){
                    this.CLEAR_ERRORS()
                    //redirect ke route home
                    this.$router.push(
                        {name: 'home'}
                        )
                }
            })
        }
    },
    destroyed(){
        this.getUserLogin()
    }
}
</script>

<style scoped>

</style>
