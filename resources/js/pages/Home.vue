<template>
    <div class="container">
        <section class="content-header">
            <h1>
                Dashboard
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i>Home </a> </li>
                <li><a href="#">Layout</a></li>
                <li class="active">Home</li>
            </ol>
        </section>

        <section class="content">
            <div class="row">
                <div class="col-md-12">
                    <div class="panel">
                        <div class="panel-heading">
                            <div class="row">
                                <!-- Form Filter Berdasarkan Bulan dan Tahun -->
                                <div class="col-md-5">
                                    <div class="form-group">
                                        <label for="">Bulan</label>
                                        <select v-model="month" class="form-control">
                                            <option value="01">Januari</option>
                                            <option value="02">Februari</option>
                                            <option value="03">Maret</option>
                                            <option value="04">April</option>
                                            <option value="05">Mei</option>
                                            <option value="06">Juni</option>
                                            <option value="07">Juli</option>
                                            <option value="08">Agustus</option>
                                            <option value="09">September</option>
                                            <option value="10">Oktober</option>
                                            <option value="11">November</option>
                                            <option value="12">Desember</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    <div class="form-group">
                                        <label for="">Tahun</label>
                                        <select v-model="year" class="form-control">
                                            <option v-for="(y,i) in years" :key="i" :value="y">
                                                {{ y }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <!-- Form Filter Berdasarkan Bulan dan Tahun -->
                                <!-- Tombol untuk Export Data ke Excel -->
                                <div class="col-md-2">
                                    <button class="btn btn-primary btn-sm pull-right"
                                    @click="exportData">Export  </button>
                                </div>
                            </div>
                        </div>
                        <div class="panel-body">
                            <!-- Tampilkan Line Chart dari Component -->
                            <!-- Kirimkan data, options, label sebagai props -->
                            <line-chart v-if="transactions.length> 0" :data="transaction_data" :options="chartOptions" :labels="labels">
                            </line-chart>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import LineChart from '../components/LineChart.vue'
import {mapActions, mapState} from 'vuex'
export default {
    created(){
        this.getChartData({
            month: this.month,
            year: this.year
        })
    },
    data(){
        return {
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            },
            month: moment().format('MM'), //default bulan ini
            year: moment().format('Y') //default tahun ini
        }
    },
    watch: {
        //ketika value bulan berubah, request data baru
        month(){
            this.getChartData({
                month: this.month,
                year: this.year
            })
        },
        //ketika value tahun berubah, request data baru
        year(){
            this.getChartData({
                month: this.month,
                year: this.year
            })
        },

    },
    computed: {
        ...mapState('dashboard', {
            transactions: state => state.transactions //ambil data dari state transaction
        }),
        ...mapState(['token']),
        //list tahun dari 2010 sampai sekarang, untuk dilooping di filter tag
        years(){
            return _.range(2010, moment().add(1, 'years').format('Y'))
        },
        //data label yang diterima dari server
        labels(){
            //karena format datanya berisi total dan date, filter hanya akan mengambil
            //datenya saja
            return _.map(this.transactions, function(o){
                return moment(o.date).format('DD')
            })
        },
        //data total transaksi yang diterima dari server
        transaction_data(){
            //filter hanya akan mengambil total valuenya saja
            return _.map(this.transactions, function(o){
                return o.total
            })
        }
    },
    methods: {
        ...mapActions('dashboard', ['getChartData']),
        exportData(){
            window.open(`api/export?api_token=${this.token}&month=${this.month}&year=${this.year}`)
        }
    },
    components: {
        'line-chart' : LineChart
    }
}
</script>
