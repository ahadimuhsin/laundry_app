<template>
    <div>
        <div class="form-group" :class="{'has-error': errors.description}">
            <label for="">Permintaan</label>
            <input type="text" class="form-control" v-model="expenses.description">
            <p class="text-danger" v-if="errors.description">{{errors.description[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error': errors.price}">
            <label for="">Biaya</label>
            <input type="text" class="form-control" v-model="expenses.price">
            <p class="text-danger" v-if="errors.price">{{errors.price[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error': errors.note}">
            <label for="">Catatan</label>
            <textarea cols="5" rows="5" class="form-control" v-model="expenses.note"></textarea>
            <p class="text-danger" v-if="errors.note">{{errors.note[0]}}</p>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
    name: 'FormExpenses',
    created(){
        //jika yang dibukan adalah halaman edit
        if(this.$route.name == 'expenses.edit'){
            //buka form ini dengan menyertakan value2nya berdasarkan ID
            this.editExpenses(this.$route.params.id).then((res) => {
                this.expenses = {
                    description: res.data.description,
                    price: res.data.price,
                    note: res.data.note
                }
            })
        }
    },
    data(){
        return {
            expenses: {
                description: '',
                price: '',
                note: ''
            }
        }
    },

    computed: {
        ...mapState(['errors']) //mengambil state errors
    },

    methods: {
        //action dari module expenses
        ...mapActions('expenses', ['submitExpenses', 'editExpenses', 'updateExpenses']),
        submit(){
            //ketika user menekan tombol Simpan, fungsi ini berjalan

            //ketika halaman yg diakses adalah halaman edit, akan diteruskan ke fungsi update
            if (this.$route.name == 'expenses.edit'){
                //ambil datanya dahulu
                let data = Object.assign({id: this.$route.params.id}, this.expenses)
                //kemudian kirim ke method update, kemudian redirect ke halaman index
                this.updateExpenses(data).then(() => this.$router.push({name: 'expenses.data'}))
            }
            else {
                //jika yang dibuka adalah halaman add
                this.submitExpenses(this.expenses).then(() => this.$router.push({name: 'expenses.data'}))
            }
        }
    },

    destroyed(){
        //ketika komponen ditinggalkan, kosongkan variabelnya
        this.expenses = {
            description: '',
            price: '',
            note: ''
        }
    }

}
</script>
