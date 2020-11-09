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

//Produk
import IndexProduct from './pages/products/Index.vue'
import DataProduct from './pages/products/Product.vue'
import AddProduct from './pages/products/Add.vue'
import EditProduct from './pages/products/Edit.vue'

//Permission
import Setting from './pages/setting/Index.vue'
import SetPermission from './pages/setting/roles/SetPermission.vue'

//Expenses
import IndexExpenses from './pages/expenses/Index.vue'
import DataExpenses from './pages/expenses/Expenses.vue'
import CreateExpenses from './pages/expenses/Add.vue'
import ViewExpenses from './pages/expenses/View.vue'
import EditExpenses from './pages/expenses/Edit.vue'

//Customers
import IndexCustomer from './pages/customers/Index.vue'
import DataCustomer from './pages/customers/Customer.vue'
import AddCustomer from './pages/customers/Add.vue'
import EditCustomer from './pages/customers/Edit.vue'

//Transaksi
import IndexTransaction from './pages/transactions/Index.vue'
import AddTransaction from './pages/transactions/Add.vue'

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
        },
        {
            path: '/products',
            component: IndexProduct,
            meta: {requiresAuth: true},
            children: [
                {
                    path: '',
                    name: 'products.data',
                    component: DataProduct,
                    meta: {title: 'Manage Products'}
                },
                {
                    path: 'add',
                    name: 'products.add',
                    component: AddProduct,
                    meta: {title: 'Tambah Data Produk Baru'}
                },
                {
                    path: 'edit',
                    name: 'products.edit',
                    component: EditProduct,
                    meta: {title: 'Ubah Data Produk'}
                }
            ]
        },
        //untuk mengatur halaman permission
        {
            path: '/setting',
            component: Setting,
            meta: {requiresAuth: true},
            children:[
                {
                path: 'role-permission',
                name: 'role.permissions',
                component: SetPermission,
                meta: {title: 'Set Permission'}
                }
            ],
        },
        {
            path: '/expenses',
            component: IndexExpenses,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'expenses.data',
                    component: DataExpenses,
                    meta: {title: 'Manage Expenses'}
                },
                {
                    path: 'add',
                    name: 'expenses.create',
                    component: CreateExpenses,
                    meta: {title: 'Tambah Biaya Baru'}
                },
                {
                    path: 'view/:id',
                    name: 'expenses.view',
                    component: ViewExpenses,
                    meta: {title: 'Liat Biaya'}
                },
                {
                    path: 'edit/:id',
                    name: 'expenses.edit',
                    component: EditExpenses,
                    meta: {title: 'Ubah Biaya'}
                }
            ]
        },
        {
            //halaman customers
            path: '/customers',
            component: IndexCustomer,
            meta: {requiresAuth: true},
            children: [
                {
                    path: '',
                    name: 'customers.data',
                    component: DataCustomer,
                    meta: {title: 'Manage Customers'}
                },
                {
                    path: '',
                    name: 'customers.add',
                    component:AddCustomer,
                    meta: { title: 'Tambah Customer Baru'}
                },
                {
                    path: 'edit/:id',
                    name: 'customers.edit',
                    component: EditCustomer,
                    meta: {title: 'Edit Customer'}
                }
            ]

        },
        {
            //halaman transaksi
            path: '/transactions',
            component: IndexTransaction,
            meta: {requiresAuth: true},
            children: [
                {
                    path: 'create',
                    name: 'transactions.add',
                    component: AddTransaction,
                    meta: {title: 'Buat Transaksi Baru'}
                }
            ]

        },
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
