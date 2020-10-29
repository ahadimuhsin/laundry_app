<template>
    <header class="main-header">
        <nav class="navbar navbar-static-top">
            <div class="container">
                <div class="navbar-header">
                    <router-link to="/" class="navbar-brand">Home</router-link>
                    <button type="button" class="navbar-toggler collapse"
                    data-toggle="collapse" data-target="#navbar-collapse">
                        <i class="fa fa-bars"></i>
                    </button>
                </div>

                <div class="collapse navbar-collapse pull-left" id="navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li><router-link to="/">Home<span class="sr-only">(current)</span></router-link></li>
                        <li v-if="$can('read outlets')"><router-link :to="{name: 'outlets.data'}">Outlet</router-link></li>
                        <li v-if="$can('read couriers')"><router-link :to="{name: 'couriers.data'}">Courier</router-link></li>
                        <li v-if="$can('read products')"><router-link :to="{name: 'products.data'}">Product</router-link></li>
                        <li><router-link :to="{name: 'expenses.data'}">Expenses</router-link></li>
                        <li class="dropdown" v-if="authenticated.role == 0">
                            <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">Settings<span class="caret"></span> </a>
                            <ul class="dropdown-menu" role="menu">
                                <li><router-link :to="{name: 'role.permissions'}">Role Permissions</router-link></li>
                            </ul>
                        </li>
                    </ul>
                    <form class="navbar-form navbar-left" role="search">
                        <div class="form-group">
                            <input type="text" class="form-control" id="navbar-search-input" placeholder="Search">
                        </div>
                    </form>
                </div>
                <div class="navbar-custom-menu">
                    <ul class="nav navbar-nav">
                        <li class="dropdown user user-menu">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <img src="https://via.placeholder.com/160" class="user-image" alt="User Image">
                                <span class="hidden-xs">{{ authenticated.name }}</span>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="user-header">
                                    <img src="https://via.placeholder.com/160" class="img-circle" alt="User Image">
                                    <p>{{authenticated.name}}</p>
                                </li>
                                <li class="user-body">
                                    <div class="row">
                                        <!-- <div class="col-xs-4 text-center">
                                            <a href="#">Followers</a>
                                        </div>
                                        <div class="col-xs-4 text-center">
                                            <a href="#">Sales</a>
                                        </div>
                                        <div class="col-xs-4 text-center">
                                            <a href="#">Friends</a>
                                        </div> -->
                                    </div>
                                </li>
                                <li class="user-footer">
                                    <div class="pull-left">
                                        <a href="#" class="btn btn-default btn-flat">Profile</a>
                                    </div>
                                    <div class="pull-right">
                                        <a href="javascript:void(0)" @click="logout" class="btn btn-default btn-flat">Sign out</a>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: "Header",
    computed: {
        ...mapState('user', {
            authenticated: state => state.authenticated //meload state authenticated
        })
    },
    methods: {
        //ketika tombol logout ditekan
        logout(){
            return new Promise((resolve, reject) => {
                localStorage.removeItem('token')//menghapus token
                resolve()
            }).then(() => {
                //memperbarui state token
                this.$store.state.token = localStorage.getItem('token')
                this.$router.push('/login') //redirect ke page login
            })
        }
    }
}
</script>

<style scoped>

</style>
