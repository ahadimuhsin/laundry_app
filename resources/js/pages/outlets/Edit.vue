<template>
 <div class="col-md-12">
     <div class="panel">
         <div class="panel-heading">
             <div class="panel-title">
                 Edit Outlet
             </div>
             <div class="panel-body">
                 <outlet-form></outlet-form>
             </div>
             <div class="form-group">
                 <button class="btn btn-primary btn-sm btn-flat"
                         @click.prevent="submit">
                     <i class="fa fa-save"></i> Update
                 </button>
             </div>
         </div>
     </div>
 </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import FormOutlets from './Form.vue'
export default {
    name: "EditOutlet",
    created() {
        //sebelum komponen dirender kita melakukan request ke server
        //berdasarkan kode yang ada di url
        this.editOutlet(this.$route.params.id)
    },
    methods: {
        ...mapActions('outlet', ['editOutlet', 'updateOutlet']),
        submit(){
            //ketika tombol diupdate maka akan mengirimkan permintaan
            //untuk mengubah data berdasarkan kode yang dikirimkan
            this.updateOutlet(this.$route.params.id).then(() => {
                //apabila berhasil, akan diredirect kembali ke halaman outlets
                this.$router.push({name: 'outlets.data'})
            })
        }
    },
    components: {
        'outlet-form': FormOutlets
    },
}
</script>
