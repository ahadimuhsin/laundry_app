<template>
    <div>
        <div class="form-group" :class="{'has-error' : errors.name}">
            <label for="">Nama Produk</label>
            <input type="text" class="form-control" v-model="product.name"
                   placeholder="Kemeja">
            <p class="text-danger" v-if="errors.name">{{errors.name[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error' : errors.unit_type}">
            <label for="">Tipe</label>
            <select v-model="product.unit_type" class="form-control">
                <option value="">Pilih</option>
                <option value="Kilogram">Kilogram</option>
                <option value="Potong">Potong</option>
            </select>
            <p class="text-danger" v-if="errors.unit_type">{{errors.unit_type[0]}}</p>
        </div>

        <div class="row">
            <div class="col-md-6">
<!--                Ketika tombol Tambah Baru Ditekan-->
                <div class="form-group" :class="{'has-error' : errors.laundry_type}">
                    <label for="">Jenis Jasa <sup><a @click="showForm = true"
                                                     href="javascript:void(0)" v-if="!showForm">
                        Tambah Baru
                    </a> </sup></label>
                    <select v-model="product.laundry_type" class="form-control">
                        <option value="">Pilih</option>
                        <option v-for="(row,index) in laundry_types" :key="index" :value="row.id">
                            {{row.name}}
                        </option>
                    </select>
                    <p class="text-danger" v-if="errors.laundry_type">{{errors.laundry_type[0]}}</p>
                </div>
            </div>

<!--            Form untuk menambahkan jenis laundry akan ditampilkan-->
            <div class="col-md-6" v-if="showForm">
                <div class="form-group" :class="{'has-error': errors.name_laundry_type}">
                    <label for="">&nbsp;</label>
                    <div class="input-group">
                        <input type="text" placeholder="Cuci Kering + Setrika" v-model="laundry_type" class="form-control">
                        <a href="javascript:void(0)" class="input-group-addon btn btn-warning btn-sm"
                           id="basic-addon2" @click="addNewLaundryType">Save</a>
                    </div>
                    <p class="text-danger" v-if="errors.name_laundry_type">{{errors.name_laundry_type[0]}}</p>
                </div>
            </div>
        </div>

        <div class="form-group" :class="{'has-error' : errors.price}">
            <label for="">Harga</label>
            <input type="text" class="form-control" v-model="product.price" v-currency="{
                locale: 'id-ID',
                currency: null,
                precision: 0,
                valueAsInteger: true,
                allowNegative: false
                }">
            <p class="text-danger" v-if="errors.price">{{errors.price[0]}}</p>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="form-group" :class="{'has-error': errors.service}">
                    <label for="">Lama Pengerjaan</label>
                    <input type="number" class="form-control" v-model="product.service">
                    <p class="text-danger" v-if="errors.service">{{errors.service[0]}}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group" :class="{'has-error': errors.service_type}">
                    <label for="">Satuan</label>
                    <select class="form-control" v-model="product.service_type">
                        <option value="">Pilih</option>
                        <option value="Hari">Hari</option>
                        <option value="Jam">Jam</option>
                    </select>
                    <p class="text-danger" v-if="errors.service_type">{{errors.service_type[0]}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutaions, mapActions} from 'vuex'
export default {
    name: "FormProduct",
    created(){
        //meload method ini ketika komponen dijalankan
        this.getLaundryType()

        //jika yang dijalankan ada route edit, ambil data produk berdasarkan ID
        if(this.$route.name == 'products.edit'){
            this.editProduct(this.$route.params.id).then((res) => {
                //kemudian variabel yang ada diisi degan data dari server
                this.product = {
                    name: res.data.name,
                    unit_type: res.data.unit_type,
                    price: res.data.price,
                    laundry_type: res.data.laundry_type_id,
                    service: res.data.service,
                    service_type : res.data.service_type
                }
            })
        }
    },
    data(){
        return {
            //definisi variabel
            product: {
                name: '',
                unit_type: '',
                price: '',
                laundry_type: '',
                service: '',
                service_type: ''
            },
            laundry_type: '',
            showForm: false
        }
    },
    computed: {
        ...mapState(['errors']), //mengambil state errors
        ...mapState('product', {
            laundry_types: state => state.laundry_types //mengambil state laundry_type
        })
    },
    methods: {
        //meload semua fungsi di module product
        ...mapActions('product', ['getLaundryType', 'addLaundryType', 'addProductLaundry', 'editProduct', 'updateProduct']),
        //funsgi yang akan berjalan ketika tombol save dari add jenis laundry ditekan
        addNewLaundryType()
        {
            //mengirimkan permintaan ke server untuk disimpan
            this.addLaundryType({name_laundry_type: this.laundry_type}).then(() => {
                //mengambil data terbaru dari server
                this.getLaundryType().then(() => {
                    //form diset ke false
                    this.showForm = false
                    this.laundry_type = '' //dan laundry_type dikosongkan
                    })
                })
        },
        //method untuk mereset isi form
        clearForm(){
            this.product = {
                name: '',
                unit_type: '',
                price: '',
                laundry_type: '',
                service: '',
                service_type: ''
            }
        },
        //ketika tombol Simpan ditekan
        submit(){
            if(this.$route.name == 'products.add'){
                this.addProductLaundry(this.product).then(() => {
                    this.clearForm()
                    //redirect kembali ke halaman list product
                    this.$router.push({name: 'products.data'})
                })
            }
            else if(this.$route.name == 'products.edit'){
                Object.assign(this.product, {id: this.$route.params.id})

                this.updateProduct(this.product).then(() => {
                    //kosongkan variabel
                    this.clearForm()
                    //redirect ke halaman index
                    this.$router.push({name : 'products.data'})
                })
            }
        }
    }
}
</script>

<style scoped>

</style>
