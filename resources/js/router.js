//import section dan halaman2 komponen
import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
//Outlet
import IndexOutlet from './pages/outlets/Index.vue'
import DataOutlet from './pages/outlets/Outlet.vue'
import AddOutlet from './pages/outlets/Add.vue'
import EditOutlet from './pages/outlets/Edit.vue'
//end of outlet
import store from './store.js'
//Kurir
import IndexCourier from './pages/couriers/Index.vue'
import DataCourier from './pages/couriers/Courier.vue'
import AddCouriers from './pages/couriers/Add.vue'
import EditCouriers from './pages/couriers/Edit.vue'


Vue.use(Router)

//Define Route
const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: { requiresAuth: true}
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/outlets',
            component: IndexOutlet,
            meta: {requiresAuth: true},
            children: [
                {
                    path: '',
                    name: 'outlets.data',
                    component: DataOutlet,
                    meta: {title: 'Manage Outlets'}
                },
                {
                    path: 'add',
                    name: 'outlets.add',
                    component: AddOutlet,
                    meta: {title: 'Add New Outlet'}
                },
                {
                    path: 'edit/:id',
                    name: 'outlets.edit',
                    component: EditOutlet,
                    meta: {title: 'Edit Outlet'}
                }
            ]
        },
        {
            path: '/couriers',
            component: IndexCourier,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'couriers.data',
                    component: DataCourier,
                    meta: { title: 'Manage Couriers'}
                },
                {
                    path: 'add',
                    name: 'couriers.add',
                    component: AddCouriers,
                    meta: { title: 'Tambah Kurir Baru'}
                },
                {
                    path: 'edit/:id',
                    name: 'couriers.edit',
                    component: EditCouriers,
                    meta: { title: 'Ubah Data Kurir'}
                },
            ]
        }

    ]
});

//Navigation Guards
router.beforeEach((to, from, next) => {
    store.commit('CLEAR_ERRORS') //membersihkan state error setiap halaman direfresh
    if(to.matched.some(record => record.meta.requiresAuth)){
        let auth = store.getters.isAuth
        if(!auth){
            next({
                name: 'login'
            })
        }else{
            next()
        }
    }
    else{
        next()
    }
})

export default router
