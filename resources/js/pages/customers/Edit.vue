<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Ubah Data Customer</h3>
            </div>
            <div class="panel-body">
                <customer-form></customer-form>
                <button class="btn btn-primary btn-sm btn-flat" @click.prevent="submit">
                    <i class="fa fa-save"></i> Simpan
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import FormCustomer from './Form'
export default {
    name: 'EditCustomer',
    created(){
        this.editCustomer(this.$route.params.id) //load single data customer
    },
    methods: {
        ...mapActions('customer', ['editCustomer', 'updateCustomer']),
        submit(){
            //mengirim permintaan ke server
            this.updateCustomer(this.$route.params.id)
            .then(() => {
                this.$router.push({name: 'customers.data'})
            })
        }
    },
    components: {
        'customer-form': FormCustomer
    }

}
</script>
