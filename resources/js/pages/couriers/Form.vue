<template>
    <div>
        <div class="form-group" :class="{'has-error': errors.name}">
            <label for="">Nama Lengkap</label>
            <input type="text" class="form-control" v-model="courier.name">
            <p class="text-danger" v-if="errors.name">{{errors.name[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error': errors.email}">
            <label for="">Email</label>
            <input type="email" class="form-control" v-model="courier.email" :readonly="$route.name === 'couriers.edit'">
            <p class="text-danger" v-if="errors.email">{{errors.email[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error': errors.password}">
            <label for="">Password</label>
            <input type="password" class="form-control" v-model="courier.password">
            <p class="text-warning" v-show="$route.name == 'outlets.edit'">Kosongkan jika kamu tidak ingin ganti password</p>
            <p class="text-danger" v-if="errors.password">{{errors.password[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error': errors.outlet_id}">
            <label for="">Outlet</label>
            <select name="outlet_id" class="form-control" v-model="courier.outlet_id">
                <option value="">Pilih</option>
                <option v-for="(row,index) in outlets.data" :value="row.id" :key="index">
                {{ row.name }}
                </option>
            </select>
            <p class="text-danger" v-if="errors.outlet_id">{{errors.outlet_id[0]}}</p>
        </div>
        <div class="form-group" :class="{'has-error': errors.photo}">
            <label for="">Foto</label>
            <input type="file" class="form-control" accept="image/*" @change="uploadImage($event)" id="file-input">
            <p class="text-warning" v-show="$route.name == 'outlets.edit'">Kosongkan jika kamu tidak ingin ganti password</p>
            <p class="text-danger" v-if="errors.photo">{{errors.photo[0]}}</p>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
    name: 'FormCourier',
    created(){
        //ketika halaman diload, fungsi untuk mengambil data outlet dijalankan
        this.getOutlets()

        //jika yang dijalankan adalah halaman edit
        if (this.$route.name == 'couriers.edit')
        {
            //mengambil data yang akan diedit dijalankan berdasarkan parameter ID
            this.editCourier(this.$route.params.id).then((res) => {
                   //fungsi yang dimasukkan ke dalam atribut kurir
                this.courier = {
                    name: res.data.name,
                    email: res.data.email,
                    password: '',
                    photo: '',
                    outlet_id: res.data.outlet_id
                }
            })
        }
    },

    data() {
        return {
            courier: {
                name: '',
                email: '',
                password: '',
                photo: '',
                outlet_id: ''
            }
        }
    },
    computed: {
        ...mapState(['errors']),
        ...mapState('outlet', {
            outlets: state => state.outlets //mengambil data outlets
        })
    },

    methods: {
        //definisi getOutlet
        ...mapActions('outlet',['getOutlets']),
        //definisi submitCourier, editCourier, updateCourier
        ...mapActions('courier', ['submitCourier', 'editCourier', 'updateCourier']),
        //memanggil mutasi
        ...mapMutations('courier', ['SET_ID_UPDATE']),

        //ketika terjadi penginputan gambar, maka file tersebut akan diassign ke dalam courier.photo
        uploadImage(event)
        {
            this.courier.photo = event.target.files[0]
        },

        //ketika tombol add new ditekan akan dijalankan fungsi submit
        submit()
        {
            //menggunakan FormData
            let form = new FormData()
            form.append('name', this.courier.name)
            form.append('email', this.courier.email)
            form.append('password', this.courier.password)
            form.append('outlet_id', this.courier.outlet_id)
            form.append('photo', this.courier.photo)

            //ketika halaman tambah kurir diakses
            if(this.$route.name == 'couriers.add'){
                //jalankan function submitCourier
                this.submitCourier(form).then(() => {
                    this.courier = {
                        name: '',
                        email: '',
                        password: '',
                        photo: '',
                        outlet_id: ''
                    }

                    //redirect ke halaman list data kurir
                    this.$router.push({name: 'couriers.data'})
                })
            }
            //jika halaman edit kurir diakses
            else if(this.$route.name == "couriers.edit"){
                //IDnya akan diassign ke state id
                this.SET_ID_UPDATE(this.$route.params.id)
                //fungsi updateCourier dijalankan
                this.updateCourier(form).then(() => {
                    //kosongkan form
                    this.courier = {
                        name: '',
                        email: '',
                        password: '',
                        photo: '',
                        outlet_id: ''
                    }
                    //redirect ke halaman list data kurir
                    this.$router.push(
                        {name: 'couriers.data'}
                    )
                })
            }
        }
    }
}
</script>
