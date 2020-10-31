<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">
                    Detail Biaya
                </h3>
            </div>
            <div class="panel-body">
                <template>
                    <!-- Detail Biaya -->
                    <dt>Permintaan Karyawan</dt>
                    <dd>- {{description}}</dd>

                    <hr>
                    <dt>Biaya yang Diperlukan</dt>
                    <dd>- Rp {{price}}</dd>

                    <hr>
                    <dt>Catatan</dt>
                    <dd>- {{note}}</dd>

                    <hr>
                    <dt>User/Kurir</dt>
                    <dd>- {{user.name}}</dd>

                    <dt>Status</dt>
                    <dd>
                        <span class="label label-success" v-if="status == 1">Diterima</span>
                        <span class="label label-warning" v-else-if="status == 0">Diproses</span>
                        <span class="label label-default" v-else>Ditolak</span>
                    </dd>

                    <hr>
                    <!-- Jika statusnya dicancel, tampilkan alasannya -->
                    <div v-if="status == 2">
                        <dt>Alasan Penolakan</dt>
                        <dd>- {{reason}}</dd>
                        <hr>
                    </div>

                    <!-- Jika masih diproses, tampilkan tombol tolak dan terima -->
                    <div class="pull-right" v-if="status == 0 || (status == 0 && !formReason)">
                        <!-- Ketika tombol ini ditekan, akan mengubah value formReason jadi true -->
                        <button class="btn btn-danger btn-sm" @click="formReason = true">Tolak</button>
                        <button class="btn btn-primary btn-sm" @click="accept">Terima</button>
                    </div>
                </template>

                <!-- Jika form reason bernilai true, form ini akan ditampilkan -->
                <div v-if="formReason">
                    <div class="form-group">
                        <label for="">Alasan Penolakan</label>
                        <input type="text" v-model="inputReason" class="form-control">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary btn-sm pull-right" @click="cancelRequest">Respon Penolakan</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    name: 'ViewExpense',
    created(){
        //ketika component diload, kita akan mengambil satu data yang akan ditampilkan
        //berdasarkan ID
        this.editExpense(this.$route.params.id).then((res) => {
            let row = res.data
            //assign semua data ke dalam variabel yang telah didefinisikan
            this.description = row.description
            this.price = row.price
            this.note = row.note
            this.status = row.status
            this.reason = row.reason
            this.user = row.user
        })
    },

    data(){
        return {
            description : '',
            price: '',
            note: '',
            status: '',
            reason: '',
            user: '',
            formReason: false,
            inputReason: ''
        }
    },

    methods: {
        ...mapActions('expenses', ['editExpenses', 'acceptExpenses', 'cancelExpenses']),
        //ketika tombol diterima ditekan, akan menjalankan fungsi accept
        accept(){

            this.$swal({
                title: 'Anda Yakin?',
                text: 'Permintaan yang disetujui tidak dapat dikembalikan!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Lanjutkan!'
            }).then((result) => {
                if(result.value){
                    //jika ya, akan mengirimkan permintaan ke server untuk mengubah
                    //status expenses menjadi diterima
                    this.acceptExpenses(this.$route.params.id)
                    .then(() => {
                        this.$router.push({name: 'expenses.data'})
                    })
                }
            })
        },

        //ketika tombol respon yang ditekan
        cancelRequest(){
            this.$swal({
                title: 'Anda Yakin?',
                text: 'Permintaan yang disetujui tidak dapat dikembalikan!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Lanjutkan!'
            }).then((result) => {
                if(result.value){
                    //jika ya, data expenses menjadi ditolak
                    this.cancelExpenses({id: this.$route.params.id, reason: this.inputReason})
                    .then(() => {
                        this.formReason = false //formReason diset kembali menjadi false
                        this.$router.push({name: 'expenses.data'})
                    })
                }
            })
        }
    }

}
</script>
