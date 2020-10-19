<template>
    <div class="col-md-12">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Tambah Produk Baru</h3>
            </div>
            <div class="panel-body">
                <product-form ref="formProduct"></product-form>
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
import {mapActions, mapState, mapMutations} from 'vuex'
import FormProduct from './Form.vue'
export default {
    name: "AddProduct",
    methods: {
        //ketika tombol tambah ditekan, fungsi ini akan berjalan
        submit()
        {
            this.$refs.formProduct.submit()
        }
    },
    components: {
        'product-form': FormProduct
    }
}
</script>

