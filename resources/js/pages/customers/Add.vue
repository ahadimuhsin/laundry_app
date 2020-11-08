<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Tambah Customer Baru</h3>
            </div>
            <div class="panel-body">
                <!-- Load form dari komponen Form.vue -->
                <customer-form></customer-form>
                <div class="form-group">
                    <button class="btn btn-primary btn-sm btn-flat" @click.prevent="submit">
                        <i class="fa fa-save"></i> Tambah
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState, mapMutations} from 'vuex'
import FormCustomer from './Form.vue'
export default {
    name: 'AddCustomer',
    data(){
        return {

        }
    },
    methods: {
        ...mapActions('customer', ['submitCustomer']),
        //ketika tombol tambah ditekan, fungsi ini akan jalan
        submit(){
            //request ke server untuk menambah data
            this.submitCustomer().then(() => {
                //redirect ke halaman list customer
                this.$router.push({name: 'customers.data'})
            })
        }
    },
    components: {
        'customer-form': FormCustomer
    }
}
</script>
