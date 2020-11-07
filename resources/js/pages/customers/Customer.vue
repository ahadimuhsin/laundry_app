<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <router-link :to="{name: 'customers.add'}" class="btn btn-primary btn-sm btn-flat">
                    Tambah
                </router-link>
                <div class="pull-right">
                    <input type="text" class="form-control" placeholder="Cari..." v-model="search">
                </div>
            </div>

            <div class="panel-body">
                <!-- Tabel -->
                <b-table striped hover bordered :items="customers.data" :fields="fields" show-empty>
                    <template v-slot:cell(deposit)="row">
                        Rp {{ row.item.deposit }}
                    </template>

                    <!-- Nama Kurir ditampilkan jika ada -->
                    <template v-slot:cell(courier_id)="row">
                        {{ row.item.courier ? row.item.courier.name : '-' }}
                    </template>

                    <!-- Actions -->
                    <template v-slot:cell(actions)="row">
                        <router-link :to="{name: 'customers.edit', params: {id: row.item.id}}" class="btn btn-warning btn-sm">
                            <i class="fa fa-pencil-alt"></i>
                        </router-link>
                        <button class="btn btn-danger btn-sm" @click="deleteCustomer(row.item.id)">
                            <i class="fa fa-trash-alt"></i>
                        </button>
                    </template>
                </b-table>

                <div class="row">
                    <div class="col-md-6">
                        <p v-if="customers.data">
                            <i class="fa fa-bars"></i>
                            {{ customers.data.length }} item dari {{ customers.meta.total }} total data
                        </p>
                    </div>

                    <div class="col-md-6">
                        <div class="pull-right">
                            <b-pagination v-model="page" :total-rows="customer.meta.total"
                            :per-page="customers.meta.per_page"
                            aria-controls="customers"
                            v-if="customers.data && customers.data.length > 0">
                            </b-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
    name: 'DataCustomer',
    created(){
        this.getCustomers() //data yang akan ditampilkan saat halaman muncul
    },
    data(){
        return {
            //field yang akan ditampilkan pada tabel
            fields: [
                {key: 'nik', label: 'NIK'},
                {key: 'name', label: 'Nama Lengkap'},
                {key: 'address', label: 'Alamat'},
                {key: 'phone', label: 'Telepon'},
                {key: 'point', label: 'Poin'},
                {key: 'deposit', label: 'Deposit'},
                {key: 'courier_id', label: 'Invited By'},
                {key: 'actions', label: 'Akis'}
            ],
            search: ''
        }
    },
    computed: {
        ...mapState('customer', {
            customers: state => state.customers
        }),

        page: {
            get(){
                return this.$store.state.customer.page
            },
            set(val){
                this.$store.commit('customer/SET_PAGE', val)
            }
        }
    },
    //mengamati perubahan pada halaman customer
    watch: {
        page(){
            this.getCustomers()
        },
        search(){
            this.getCustomers(this.search)
        }
    },

    methods: {
        ...mapActions('customer', ['getCustomers', 'removeCustomer']),

        //ketika tombol delete ditekan
        deleteCustomer(id){
            this.$swal({
                title: 'Yakin mau dihapus?',
            text: 'Tindakan ini akan menghapus data secara permanent',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Lanjutkan!!"
            }).then((result) => {
             //jika disetujui, jalankan fungsi removeOutlet
                if(result.value){
                this.removeCustomer(id)
                }
            })
        }
    }
}
</script>
