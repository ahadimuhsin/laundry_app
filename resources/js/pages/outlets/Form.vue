<template>
    <div>
        <div class="form-group" :class="{'has-error' : errors.code}">
            <label for="code">Kode Outlet</label>
            <input type="text" id="code" name="code" class="form-control" v-model="outlet.code"
            :readonly="$route.name === 'outlets.edit'   ">
            <p class="text-danger" v-if="errors.code">{{errors.code[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error' : errors.name}">
            <label for="name">Nama Outlet</label>
            <input type="text" name="name" id="name" class="form-control" v-model="outlet.name">
            <p class="text-danger" v-if="errors.name">{{errors.name[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error' : errors.address}">
            <label for="address">Alamat</label>
            <textarea cols="5" rows="5" name="address" id="address" class="form-control" v-model="outlet.address"></textarea>
            <p class="text-danger" v-if="errors.address">{{errors.address[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error' : errors.phone}">
            <label for="phone">Nomor Telepon</label>
            <input type="text" name="phone" id="phone" class="form-control" v-model="outlet.phone">
            <p class="text-danger" v-if="errors.phone">{{errors.phone[0]}}</p>
        </div>
        <div class="form-group">
            <input type="checkbox" v-model="outlet.status" value="1" name="status" id="status">
            <label for="status">Set Active</label>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    name: "FormOutlets",
    computed: {
        ...mapState(['errors']), //mengambil state errors
        ...mapState('outlet', {
            outlet: state => state.outlet //mengambil state outlet
        })
    },
    methods: {
        ...mapMutations('outlet', ['CLEAR_FORM']), //panggil mutations clear_form
    },
    //ketika page ini ditinggalkan maka
    destroyed(){
        this.CLEAR_FORM()
    }
}
</script>

