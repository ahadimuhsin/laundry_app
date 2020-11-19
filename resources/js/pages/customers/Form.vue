<template>
    <div>
        <div class="form-group" :class="{'has-error': errors.nik}">
            <label for="nik">NIK</label>
                <input type="text" class="form-control" v-model="customer.nik"
                name="nik">
                <p class="text-danger" v-if="errors.nik">{{errors.nik[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error': errors.name}">
            <label for="name">Name</label>
                <input type="text" class="form-control" v-model="customer.name" name="name">
                <p class="text-danger" v-if="errors.name">{{errors.name[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error': errors.address}">
            <label for="address">Alamat</label>
                <input type="text" class="form-control" v-model="customer.address" name="address">
                <p class="text-danger" v-if="errors.address">{{errors.address[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error': errors.phone}">
            <label for="phone">Nomor Telepon</label>
                <input type="text" class="form-control" v-model="customer.phone" v-mask="'+62############'" name="phone">
                <p class="text-danger" v-if="errors.phone">{{errors.phone[0]}}</p>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    name: 'FormCustomer',
    computed: {
        ...mapState(['errors']),
        ...mapState('customer', {
            customer: state => state.customer
        })
    },
    methods: {
        ...mapMutations('customer', ['CLEAR_FORM']),
    },

    destroyed(){
        this.CLEAR_FORM()
    }

}
</script>
