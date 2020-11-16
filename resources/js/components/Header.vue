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
                        <li><router-link :to="{name: 'customers.data'}">Customer</router-link></li>
                        <li class="dropdown">
                            <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">Transactions<span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><router-link :to="{name: 'transactions.list'}">List</router-link></li>
                                <li><router-link :to="{name: 'transactions.add'}">Add</router-link></li>
                            </ul>
                        </li>
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
                <!-- Hanya muncul apabila yang login adalah superadmin atau finance -->
                <div class="navbar-custom-menu">
                    <ul class="nav navbar-nav">
                        <li class="dropdown messages-menu" v-if="authenticated.role == 0 || authenticated.role == 2">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <i class="fa fa-bell-o"></i>

                                <!-- Menghitung jumlah data notifikasi yang ada -->
                                <span class="label label-success">{{notifications.length}}</span>
                            </a>
                            <ul class="dropdown-menu">
                                <li class="header">Kamu punya {{notifications.length}} pesan</li>
                                <li>
                                    <ul class="menu" v-if="notifications.length > 0">
                                        <!-- Looping data notifikasi -->
                                        <li v-for="(row, index) in notifications" :key="index">
                                            <a href="javascript:void(0)" @click="readNotif(row)">
                                                <div class="pull-left">
                                                    <img src="https://via.placeholder.com/160" class="img-circle" alt="User Image">
                                                </div>
                                                <h4>
                                                    <!-- Nama pengirim notifikasi -->
                                                    {{ row.data.sender_name }}

                                                    <small><i class="fa fa-clock-o"></i> {{row.created_at | formatDate}}</small>
                                                </h4>
                                                <!-- jenis permintaan notifikasi -->
                                                <p>{{row.data.expenses.description.substr(0,30)}}</p>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
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
import {mapState, mapActions} from 'vuex'
import moment from 'moment'
export default {
    name: "Header",
    computed: {
        ...mapState('user', {
            authenticated: state => state.authenticated //meload state authenticated
        }),

        //state notification
        ...mapState('notification', {
            notifications: state => state.notifications
        })
    },

    filters: {
        //mengubah format tanggan menjadi time ago
        formatDate(val)
        {
            return moment(new Date(val)).fromNow()
        }
    },

    methods: {
        //import actions dari notifications
        ...mapActions('notification', ['readNotification']),

        //ketika tombol notifikasi diklik
        readNotif(row){
            //mengirim permintaan ke server bahwa notifikasi telah dibaca
            //kemudian selanjutnya redirect ke halalamn view expenses
            this.readNotification({id: row.id})
            .then(() => this.$router.push({name: 'expenses.view', params: {id: row.data.expenses.id}}))
        },
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
