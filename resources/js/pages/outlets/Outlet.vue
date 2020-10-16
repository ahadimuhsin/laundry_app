<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <router-link :to="{name: 'outlets.add'}" class="btn btn-primary btn-sm btn-flat">Tambah</router-link>
                <div class="pull-right">
                    <input type="text" class="form-control" placeholder="Cari..." v-model="search">
                </div>
            </div>
            <div class="panel-body">
<!--                b-table atribut dari bootstrap vue-->
                <b-table striped hover bordered :items="outlets.data" :fields="fields" show-empty>
                    <template v-slot:cell(status)="row">
                        <span class="label label-success" v-if="row.item.status === 1">Active</span>
                        <span class="label label-default" v-else>Non Active</span>
                    </template>
                    <template v-slot:cell(actions)="row">
                        <router-link :to="{name: 'outlets.edit', params: {id: row.item.code}}"
                        class="btn btn-warning btn-sm"><i class="fa fa-pencil"></i> </router-link>
                        <button class="btn btn-danger btn-sm" @click="deleteOutlet(row.item.id)">
                            <i class="fa fa-trash"></i>
                        </button>
                    </template>
                </b-table>

                <div class="row">
                    <div class="col-md-6">
                        <p v-if="outlets.data"><i class="fa fa-bars"></i>
                        {{outlets.data.length}} item dari {{outlets.meta.total}} total</p>
                    </div>
                    <div class="col-md-6">
                        <div class="pull-right">
                            <b-pagination v-model="page"
                                          :total-rows="outlets.meta.total"
                                          :per-page="outlets.meta.per_page"
                                          aria-controls="outlets"
                                          v-if="outlets.data && outlets.data.length > 0">
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
    name: "DataOutlet",
    created(){
        //sebelum komponen di-load, request data dari server
        this.getOutlets()
    },
    data(){
        return {
            //field untuk b-table, pastikan keynya sesuai
            //dengan field database agar otomatis dirender
            fields: [
                {key: 'code', label: 'Kode Outlet'},
                {key: 'name', label: 'Nama Outlet'},
                {key: 'address', label: 'Alamat'},
                {key: 'phone', label: 'Nomor Telepon'},
                {key: 'status', label: 'Status'},
                {key: 'actions', label: 'Aksi'}
            ],
            search: ''
        }
    },
    computed: {
        //mengambil data outlet dari state outlet
        ...mapState('outlet', {
            outlets: state => state.outlets
        }),
        page: {
            get(){
                //mengambil value page dari vuex module outlet
                return this.$store.state.outlet.page
            },
            set(val){
                //apabila terjadi perubahan value dari page, maka state page
                //di Vuex juga akan diubah
                this.$store.commit('outlet/SET_PAGE', val)
            }
        }
    },
    //amati perubahannya
    watch: {
        page(){
            //apabila value page dari VUEX module outlet berubah
            this.getOutlets()
        },
        search(){
            //apabila value dari search berubah maka akan meminta data sesuai
            //dengan data yang dicari
            this.getOutlets(this.search)
        }
    },
    methods: {
        //mengambil fungsi dari Vuex Module outlet
        ...mapActions('outlet', ['getOutlets', 'removeOutlet']),
        //ketika tombol hapus diklik, method deleteOutlet jalan
        deleteOutlet(id){
            //pop up sweet alert dialog
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
                    this.removeOutlet(id)
                }
            })
        }
    }
}
</script>

