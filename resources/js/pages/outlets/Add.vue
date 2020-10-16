<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Tambah Outlet Baru</h3>
            </div>
            <div class="panel-body">
<!--                Komponen Outlet Form-->
                <outlet-form></outlet-form>
                <div class="form-group">
                    <button class="btn btn-primary btn-sm btn-flat" @click.prevent="submit">
                        <i class="fa fa-save"></i> Simpan
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
        name: 'AddOutlet',
        data(){
            return {

            }
        },
        methods: {
            ...mapActions('outlet', ['submitOutlet']), //panggil actions submitOutlet
            submit(){
                //ketika tombol ditekan maka fungsi ini dijalankan
                this.submitOutlet().then(() => {
                    //apabila berhasil maka diredirect ke halaman /oulets
                    this.$router.push({name: 'outlets.data'})
                })
            }
        },
        components: {
            'outlet-form' : FormOutlets
        }
    }
</script>
