<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-6" v-if="transaction.status == 0">
                        <!-- Form Pembayaran -->
                        <h4>Payment</h4>
                        <hr>
                        <div class="form-group">
                            <label for="">Tagihan</label>
                            <input type="text" :value="transaction.amount" class="form-control" readonly>
                        </div>
                        <div class="form-group">
                            <label for="">Jumlah Bayar</label>
                            <input type="number" class="form-control" v-model="amount">
                        </div>
                        <p v-if="isCustomerChange">Kembalian: Rp {{customerChangeAmount}}</p>
                        <div class="form-group" v-if="isCustomerChange">
                            <input type="checkbox" v-model="customer_change" id="customer_change">
                            <label for="customer_change">Kembalian jadi deposit?</label>
                        </div>
                        <p class="text-danger" v-if="payment_message">{{payment_message}}</p>
                        <button class="btn btn-primary btn-sm" :disabled="loading" @click="makePayment">
                            Bayar
                        </button>
                    </div>
                    <div class="col-md-6" v-if="transaction.customer">
                        <!-- Menampilkan Detail Informasi Customer terkait -->
                        <h4>Customer</h4>
                        <hr>
                        <table>
                            <tr>
                                <th width="30%">NIK</th>
                                <td width="5%">:</td>
                                <td>{{transaction.customer.nik}}</td>
                            </tr>
                            <tr>
                                <th>No Telpon</th>
                                <td>:</td>
                                <td>{{transaction.customer.phone}}</td>
                            </tr>
                            <tr>
                                <th>Alamat</th>
                                <td>:</td>
                                <td>{{transaction.customer.address}}</td>
                            </tr>
                            <tr>
                                <th>Deposit</th>
                                <td>:</td>
                                <td>{{transaction.customer.deposit}}</td>
                            </tr>
                            <tr>
                                <th>Point</th>
                                <td>:</td>
                                <td>{{transaction.customer.point}}</td>
                            </tr>
                        </table>
                    </div>

                    <div class="col-md-6" v-if="transaction.payment">
                        <!-- Menampilkan Riwayat Pembayaran Order Tersebut -->
                        <h4>Riwayat Pembayaran</h4>
                        <hr>
                        <table>
                            <tr>
                                <th width="30%">Jumlah Pembayaran</th>
                                <td width="5%">:</td>
                                <td>{{transaction.payment.amount}}</td>
                            </tr>
                            <tr>
                                <th>Kembalian</th>
                                <td>:</td>
                                <td>{{transaction.payment.customer_change}}</td>
                            </tr>
                            <tr>
                                <th>Metode Pembayaran</th>
                                <td>:</td>
                                <td>{{transaction.payment.type_label}}</td>
                            </tr>
                        </table>
                    </div>

                    <div class="col-md-12" style="padding-top: 20px">
                        <div class="alert alert-success" v-if="payment_success">
                            Pembayaran Berhasil
                        </div>
                        <h4>Detail Transaksi</h4>
                        <hr>
                        <div class="table-responsive">
                            <table class="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th>Paket</th>
                                        <th width="20%">Waktu Layanan</th>
                                        <th>Berat Satuan</th>
                                        <th>Harga</th>
                                        <th>Subtotal</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Loopong Detail Transaksi -->
                                    <tr v-for="(row,index) in transaction.detail" :key="index">
                                        <td>
                                            <strong>{{row.product.name}}</strong>
                                            <sup v-html="row.status_label"></sup>
                                        </td>
                                        <td>{{row.service_time}}</td>
                                        <td>
                                            {{ row.qty }} ({{ row.product.unit_type }})
                                        </td>
                                        <td>Rp {{row.price}} / {{row.product.unit_type}}</td>
                                        <td>Rp {{row.subtotal}}</td>
                                        <td>
                                            <!-- Tombol untuk menyelesaikan setiap pesanan -->
                                            <!-- Ditampilkan ketika pembayaran sudah dilakukan
                                            dan statusnya masih proses -->
                                            <button class="btn btn-success btn-sm" v-if="transaction.status == 1 && row.status == 0"
                                            @click="isDone(row.id)">
                                            <!-- Akan menjalankan funsgi isDone ketika diklik -->
                                            <i class="fa fa-paper-plane-o"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import {mapActions, mapState, mapMutations} from 'vuex'
export default {
    name: 'DetailTransaction',
    created(){
        //load data ini ketika component diload
        this.detailTransaction(this.$route.params.id)
    },
    data(){
        //definisi variabel yang nanti akan digunakan
        return {
            amount: null,
            customer_change: null,
            loading: false,
            payment_message: null,
            payment_success: false
        }
    },
    computed: {
        ...mapState('transaction', {
            //ambil data transaksi dari state transaction
            transaction: state => state.transaction
        }),
        //memeriksa apakah user punya kembalian
        isCustomerChange(){
            return this.amount > this.transaction.amount
        },
        //menghitung selisih tagihan dan jumlah yang dibayar
        customerChangeAmount(){
            return parseInt(this.amount - this.transaction.amount)
        }
    },
    methods: {
        ...mapActions('transaction', ['detailTransaction', 'completeItem', 'payment']),
        makePayment(){
            //jika jumlah pembayaran kurang dari tagihan
            if(this.amount < this.transaction.amount){
                this.payment_message = 'Pembayaran Kurang Dari Tagihan'
                //hentikan proses
                return
            }

            //jika tidak
            this.loading = true
            //buat proses ke server
            this.payment({
                //kirimkan parameter berikut
                transaction_id: this.$route.params.id,
                amount: this.amount,
                customer_change: this.customer_change
            }).then(() => {
                //set bahwa payment berhasil
                this.payment_success = true
                setTimeout(() => {
                    //set loading jadi false kembali
                    this.loading = false,
                    //set semua variabel jadi kosong
                    this.amount = null,
                    this.customer_change = false,
                    this.payment_message = null
                }, 3000)
                //ambil data transaksi terbaru
                this.detailTransaction(this.$route.params.id)
            })
        },
        //ketika tombol masing2 pesanan diklik
        isDone(id){
            this.$swal({
                title: 'Yakin mau hapus data ini?',
                text: 'Data ini akan dihapus secara permanen',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: 'Lanjutkan!'
            }).then((result) => {
                if(result.value){
                    //jika setuju, maka kirim permintaan ke server
                    this.completeItem({id: id}).then(() => {
                        this.detailTransaction(this.$route.params.id)
                    })
                }
            })
        }
    }
}
</script>
