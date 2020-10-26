<template>
    <div class="col-md-12">
        <div class="row">
            <div class="col-md-5">
                <div class="panel">
                    <div class="panel-heading">
                        <h3 class="panel-title">Pasang Role ke User</h3>
                    </div>

                    <!-- Form untuk menambah role ke user -->
                    <div class="panel-body">
                        <div class="alert alert-succes" v-if="alert_role">
                            Role Berhasil Ditambahkan
                        </div>
                        <div class="form-group">
                            <label for="">Role</label>
                            <select class="form-control" v-model="role_user.role">
                                <option value="">Pilih Role</option>
                                <option v-for="(row, index) in roles" :value="row.name" :key="index">
                                    {{ row.name }}
                                </option>
                            </select>
                            <p class="text-danger" v-if="errors.role_id">{{errors.role_id[0]}}</p>
                        </div>
                        <div class="form-group">
                            <label for="">User</label>
                            <select class="form-control" v-model="role_user.user_id">
                                <option value="">Pilih User</option>
                                <option v-for="(row, index) in users" :value="row.id" :key="index">
                                    {{ row.name }} ({{ row.email }})
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <button class="btn btn-danger btn-sm" @click="setRole">
                                Set Role
                            </button>
                        </div>
                    </div>
                </div>
                </div>

                <div class="col-md-7">
                    <div class="panel">
                        <div class="panel-heading">
                            <h3 class="panel-title">Atur Izin</h3>
                        </div>
                        <!-- Form untuk menambahkan Permission ke Masing-masing Role -->
                        <div class="panel-body">
                            <div class="form-group">
                                <label for="">Role</label>
                                <select class="form-control" v-model="role_selected">
                                    <option value="">Pilih</option>
                                    <option v-for="(row, index) in roles" :value="row.id" :key="index">
                                        {{ row.name }}
                                    </option>
                                </select>
                                <p class="text-danger" v-if="errors.role_id">{{ errors.role_id[0]}}</p>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-primary btn-sm" @click="checkPermission">
                                    {{ loading ? 'Loading...' : 'Check' }}
                                </button>
                            </div>
                            <div class="form-group">
                                <div class="alert alert-success" v-if="alert_permission">Izin telah dberikan</div>
                                <div class="nav-tabs-custom">
                                    <ul class="nav nav-tabs">
                                        <li class="active">
                                            <a href="#tab1" data-toggle="tab">Permissions</a>
                                        </li>
                                    </ul>
                                    <div class="tab-content">
                                        <div class="tab-pane active" id="tab1">
                                            <template v-for="(row, index) in permissions">
                                                <input type="checkbox" class="minimal-red"
                                                :key="index"
                                                :value="row.name"
                                                :checked="role_permission.findIndex(x => x.name == row.name) != -1"
                                                @click="addPermission(row.name)">
                                                {{ row.name }} <br :key="'row' + index">

                                                <br :key="'enter' + index" v-if="(index+1) %4 == 0">
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="pull-right">
                                <button class="btn btn-primary btn-sm" @click="setPermission">
                                    <i class="fa fa-send"></i> Atur Izin
                                </button>
                            </div>
                        </div>
                        <!-- AKhir dari Form -->
                    </div>
                </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState, mapMutations} from 'vuex'
export default {
    name: 'SetPermission',
    data(){
        return {
            role_user: {
                role: '',
                user_id: ''
            },
            role_selected: '',
            new_permission: [],
            loading: false,
            alert_permission: false,
            alert_role: false
        }
    },

    created()
    {
        //ketika component di-load, maka kita akan merequest 3 data berikut
        this.getRoles() //data roles
        this.getAllPermission() //data permission
        this.getUserLists() //data user
    },
    computed: {
        ...mapState(['errors']),
        ...mapState('user', {
            users: state => state.users, //state users
            roles: state => state.roles, //state roles
            permissions: state => state.permissions, //state permission

            //state yang menampung permission yang telah di-assign
            role_permission: state => state.role_permission
        })
    },
    methods: {
        //load semua fungsi yang ada di module store/user
        ...mapActions('user', [
            'getUserLists',
            'getRoles',
            'getAllPermission',
            'getRolePermission',
            'setRolePermission',
            'setRoleUser'
        ]),
        //load mutasi dari store user
        ...mapMutations('user', ['CLEAR_ROLE_PERMISSION']),
        //fungsi ini akan berjalan ketika tombol set role diklik
        setRole() {
            //kirim permintaan e backend
            this.setRoleUser(this.role_user).then(() => {
                this.alert_role = true //aktfikan alert jika berhasil
                setTimeout(() => {
                    //beberapa detik kemudian, set default role user
                    this.role_user = {
                        role: '',
                        user_id: ''
                    }
                    //matikan alert
                    this.alert_role = false
                }, 3000)
            })
        },

        //ketika list permission dicentang, fungsi ini berjalan
        addPermission(name){
            //dicek ke new permission berdasarkan name
            let index = this.new_permission.findIndex(x => x == name)
            //apabila tidak tersedia, indexnya -1
            if (index == -1)
            {
                //tambahkan ke list
                this.new_permission.push(name)
            }
            else{
                //jika sudah ada, hapus dari list
                this.new_permission.splice(index,1)
            }
        },

        //ketika tombol check ditekan, fungsi ini berjalan
        //fungsi ini untuk mengambil list permission yang telah diassign
        //ke dalam role yang dipilih
        checkPermission(){
            this.loading = true //aktifkan tombol loading
            //kirim permintaan ke backend
            this.getRolePermission(this.role_selected).then(() => {
                //apabila berhasil, matikan loading
                this.loading = false
                //permission yang tang telah diassign akan dimerge
                //ke new permission
                this.new_permission = this.role_permission
            })
        },

        //fungsi ini berjalan ketika tombol set permission ditekan
        setPermission(){
            //kirim permintaan ke server
            this.setRolePermission({
                role_id : this.role_selected,
                permissions: this.new_permission
            }).then((res) => {
                //apabila berhasil
                if(res.status == 'success'){
                    //nyalakan alert
                    this.alert_permission = true
                    setTimeout(() => {
                        this.role_selected = ''
                        this.new_permission = []
                        this.loading = false
                        this.alert_permission = false
                        this.CLEAR_ROLE_PERMISSION()
                    }, 3000)
                }
            })
        }
    }
}
</script>

<style type="text/css">
    .tab-pane{
        height: 150px;
        overflow-y: scroll;
    }
</style>
