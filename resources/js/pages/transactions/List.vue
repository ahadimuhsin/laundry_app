<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <router-link :to="{name: 'transactions.add'}" class="btn btn-primary btn-sm btn-flat">
                    Tambah Transaksi Baru
                </router-link>
                <div class="pull-right">
                    <div class="row">
                        <!-- Form untuk Filter Berdasarkan Status -->
                        <div class="col-md-6">
                            <select v-model="filter_status" class="form-control">
                                <option value="2">All</option>
                                <option value="1">Selesai</option>
                                <option value="0">Proses</option>
                            </select>
                        </div>

                        <!-- Form untuk melakukan pencarian -->
                        <div class="col-md-6">
                            <input type="text" class="form-control" placeholder="Cari..." v-model="search">
                        </div>
                    </div>
                </div>
            </div>

            <div class="panel-body">
                <!-- Menampilkan Data Transaksi -->
                <b-table striped hover bordered :items="transactions.data" :fields="fields" show-empty>
                    <template v-slot:cell(customer)="row">
                        <p><strong>{{row.item.customer ? row.item.customer.name: ''}}</strong></p>
                        <p>Telp: {{row.item.customer.phone}}</p>
                        <p>NIK: {{row.item.customer.nik}}</p>
                    </template>
                    <template v-slot:cell(user_id)="row">
                        <p>{{row.item.user ? row.item.user.name: ''}}</p>
                    </template>
                    <template v-slot:cell(service)="row">
                        <p class="text-center">{{row.item.detail.length}}</p>
                    </template>
                    <template v-slot:cell(amount)="row">
                        <p>{{row.item.amount | toCurrency}}</p>
                    </template>
                    <template v-slot:cell(created_at)="row">
                        <p>{{row.item.created_at | formattedDate}}</p>
                    </template>
                    <template v-slot:cell(status)="row">
                        <p v-html="row.item.status_label"></p>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <router-link :to="{name: 'transactions.view', params: {id: row.item.id}}"
                        class="btn btn-info btn-sm"><i class="fa fa-eye"></i></router-link>
                    </template>
                </b-table>

                <div class="row">
                    <div class="col-md-6">
                        <p v-if="transactions.data">
                            <i class="fa fa-bars"></i>
                            {{ transactions.data.length }} item dari {{ transactions.meta.total }} total data
                        </p>
                    </div>
                    <div class="col-md-6">
                        <div class="pull-right">
                            <b-pagination
                            v-model="page"
                            :total-rows="transactions.meta.total"
                            :per-page="transactions.meta.per_page"
                            aria-controls="transactions"
                            v-if="transactions.data && transactions.data.length > 0"
                            ></b-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import moment from 'moment'
import 'moment/locale/id'
moment.locale('id')
export default {
    name: 'DataTransaction',
    created(){
        this.getTransactions({
            status: this.filter_status,
            search: this.search
        })
    },
    data(){
        return {
            //field yang akan digunakan pada tabel di atas
            fields: [
                {key: 'id', label: 'Order ID'},
                {key: 'customer', label: 'Customer'},
                {key: 'user_id', label: 'Admin'},
                {key: 'service', label: 'Jumlah Item'},
                {key: 'amount', label: 'Total'},
                {key: 'created_at', label: 'Tanggal Transaksi'},
                {key: 'status', label: 'Status'},
                {key: 'actions', label: 'Aksi'}
            ],
            search: '',
            filter_status: 2
        }
    },
    computed: {
        //ambil data dari state list transaction
        ...mapState('transaction', {
            transactions: state => state.list_transaction
        }),

        //ambil data page yang aktif
        page: {
            get(){
                return this.$store.state.transaction.page
            },
            set(val){
                this.$store.commit('transaction/SET_PAGE', val)
            }
        }
    },
    watch: {
        //jika pagenya berubah value
        page(){
            //get data customer yang baru berdasarkan page
            this.getTransactions({
                status: this.filter_status,
                search: this.search
            })
        },
        //jika search valuenya berubah
        search(){
            //ambil data customer beru berdasarkan filter search
            this.getTransactions({
                status: this.filter_status,
                search: this.search
            })
        },
        //jika filter status berubah
        filter_status()
        {
            //ambil data customer berdasarkan filternya
          this.getTransactions({
                status: this.filter_status,
                search: this.search
            })
        }
    },
    methods: {
        ...mapActions('transaction', ['getTransactions'])
    },
    filters: {
        toCurrency(value){
            if (typeof value !== "number"){
                return value;
            }
            let formatter = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(value);
            return formatter;
        },
        formattedDate(value){
            if(value){
                return moment(String(value)).format('DD MMMM YYYY HH:MM:ss  ')
            }
        }
    }
}
</script>
