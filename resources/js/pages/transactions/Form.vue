<template>
    <div class="row">
        <div class="col-md-6">
            <div class="form-group" :class="{'has-error': errors.customer_id}">
                <label for="">Customer<sup><a href="javascript:void(0)"
                @click="newCustomer"></a> </sup></label>

                <!-- Akan menggunakan v-select di mana datanya akan diload
                ketika keyword pencarian ditemukan -->
                <v-select :options="customers.data"
                    v-model="transactions.customer_id"
                    @search="onSearch"
                    label="name"
                    placeholder="Keyword..."
                    :filterable="false">
                    <template v-slot:no-options>
                        Masukkan Kata Kunci
                    </template>
                    <template v-slot:cell(option)="option">
                        {{ option.name }}
                    </template>
                </v-select>
                <p class="text-danger" v-if="errors.customer_id">{{errors.customer_id[0]}}</p>
            </div>
        </div>
        <div class="col-md-6" v-if="transactions.customer_id != null && !isForm">
            <table>
                <tr>
                    <th width="30%">NIK</th>
                    <td width="5%">:</td>
                    <td>{{transactions.customer_id.nik}}</td>
                </tr>
                <tr>
                    <th>Nomor Telepon</th>
                    <td>:</td>
                    <td>{{ transactions.customer_id.phone }}</td>
                </tr>
                <tr>
                    <th>Alamat</th>
                    <td>:</td>
                    <td>{{ transactions.customer_id.address }}</td>
                </tr>
                <tr>
                    <th>Deposit</th>
                    <td>:</td>
                    <td>{{ transactions.customer_id.deposit }}</td>
                </tr>
                <tr>
                    <th>Point</th>
                    <td>:</td>
                    <td>{{ transactions.customer_id.point }}</td>
                </tr>
            </table>
        </div>

        <!-- Tombol New Customer -->
        <!-- Hanya muncul ketika isForm is true -->
        <div class="col-md-6" v-if="isForm">
            <h4>Tambah Customer Baru</h4>
            <!-- Komponen fomr customer -->
            <form-customer></form-customer>
            <button class="btn btn-primary btn-sm" @click="addCustomer">
                Simpan
            </button>
        </div>
        <div class="col-md-12">
            <hr>
            <button v-if="filterProduct.length == 0" class="btn btn-warning btn-sm" style="margin-bottom: 10px"
            @click="addProduct">Tambah</button>
            <div class="table-responsive">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th width="40%">Paket</th>
                            <th>Berat/Satuan</th>
                            <th>Harga</th>
                            <th>Subtotal</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(row, index) in transactions.detail" :key="index">
                            <td>
                                <v-select :options="products.data"
                                    v-model="row.laundry_price"
                                    @search="onSearchProduct"
                                    label="name"
                                    placeholder="Keyword"
                                    :filterable="false">
                                    <template v-slot:no-options>
                                        Masukkan Kata Kunci
                                    </template>
                                    <template v-slot:cell(option)="option">
                                        {{ option.name }}
                                    </template>
                                </v-select>
                            </td>
                            <td>
                                <div class="input-group">
                                    <input type="number" v-model="row.qty" class="form-control" @blur="calculate(index)">
                                    <span class="input-group-addon">{{row.laundry_price != null && row.laundry_price.unit_type == 'Kilogram' ? 'gram' : 'pcs'}}</span>
                                </div>
                            </td>
                            <td>Rp {{row.price}}</td>
                            <td>Rp {{row.subtotal}}</td>
                            <td>
                                <button class="btn btn-danger btn-flat" @click="removeProduct(index)">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Ketika Transaksi Berhasil, alertnya ditampilkan -->
        <div class="col-md-12" v-if="isSuccess">
            <div class="alert alert-success">
                Transaksi Berhasil, Total Tagihan: Rp {{ total }}

                <strong><router-link :to="{name: 'transactions.view', params:{id: transaction_id}}">Lihat Detail</router-link></strong>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import _ from 'lodash'
import FormCustomer from '../customers/Form'
export default {
    name: 'FormTransaction',
    data(){
        return {
            isForm: false,
            isSuccess: false,
            transactions: {
                customer_id: null,
                //set default detailnya item yang koson
                detail: [
                    {laundry_price: null, qty:1, price: 0, subtotal: 0}
                ]
            },
            transaction_id: null
        }
    },
    computed: {
        ...mapState(['errors']),
        ...mapState('transaction', {
            customers: state => state.customers, //ambil state customers
            products: state => state.products //ambil state products
        }),
        filterProduct(){
            return _.filter(this.transactions.detail, function(item){
                return item.laundry_price == null
            })
        },
        total(){
            return _.sumBy(this.transactions.detail, function(o){
                return parseFloat(o.subtotal)
            })
        }
    },
    methods: {
        ...mapActions('transaction', ['getCustomers', 'getProducts', 'createTransaction']),
        ...mapActions('customer', ['submitCustomer']),
        //method ini akan berjalan ketika pencarian data customer pada v-select
        onSearch(search, loading){
            //request data customer berdasarkan keyword yang diminta
            this.getCustomers({
                search: search,
                loading: loading
            })
        },
        //method ini untuk pencarian data produk untuk item laundry
        onSearchProduct(search, loading){
        //merequest data product
        this.getProducts({
            search: search,
            loading: loading
            })
        },

        //ketika tombol tambahkan ditekan, akan menambahkan item baru
        addProduct(){
            if(this.filterProduct.length == 0){
                this.transactions.detail.push({
                    laundry_price: null,
                    qty: null,
                    price: 0,
                    subtotal: 0
                })
            }
        },
        //ketika tombol hapus pada masing2 item ditekan, akan menghapus berdasarkan index datanya
        removeProduct(index){
            if(this.transactions.detail.length > 1){
                this.transactions.detail.splice(index, 1)
            }
        },

        //ketika inputan qty/berat/satuan un-focus, maka fungsi ini akan dijalankan
        calculate(index){
            let data = this.transactions.detail[index]
            if(data.laundry_price != null){
                //isi price untuk setiap itemnya dan pricenya didapatkan dari data product laundry
                data.price = data.laundry_price.price
                //adapun subtotal akan dihitung berdasarkan jenisnya
                if(data.laundry_price.unit_type == 'Kilogram'){
                    //jika Kilogram, maka berat barang * harga /1000
                    data.subtotal = (parseInt(data.laundry_price.price) * (parseInt(data.qty) / parseInt(1000))).toFixed(2)

                }else {
                    //jika satuan, maka harga * qty
                    data.subtotal = parseInt(data.laundry_price.price) * parseInt(data.qty)
                }
            }
        },
        submit(){
            this.isSuccess = false
            let filter = _.filter(this.transactions.detail, function(item){
                return item.laundry_price != null
            });

            if (filter.length > 0){
                //mengirim permintaan ke server untuk mneyimpan data transaksi
                this.createTransaction(this.transactions)
                .then((res) =>{
                this.transaction_id = res.data.id
                this.isSuccess = true
                })
            }
        },
        //mereset form
        resetForm()
        {
            this.transactions = {
                customer_id : null,
                detail: [
                    {
                        laundry_price: null, qty:1, price:0, subtotal: 0
                    }
                ]
            }
        },
        newCustomer(){
            this.isForm = true //mengubah valurm menjadi isForm
        },
        // Ketika tombol Simpan Customer ditekan, akan menjalankan fungsi ini
        addCustomer(){
            this.submitCustomer().then((response) => {
                this.transactions.customer_id = res.data
                this.isForm = false
            })
        }
    },

    components: {
        vSelect,
        'form-customer': FormCustomer
    }

}
</script>
