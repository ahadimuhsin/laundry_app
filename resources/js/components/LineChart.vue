<script>
import {Line} from 'vue-chartjs'
export default {
    extends: Line,
    props: [
        'data', 'options', 'labels'
    ], //ketika component ini digunakan, akan meminta data sebagai props
    mounted(){
        this.lineRenderChart()
    },
    watch: {
        //ketika terjadi perubahan value dari props data
        data: {
            handler(){
                this._data._chart.destroy() //hapus chart
                this.lineRenderChart() //render chart kembali dengan data yang baru
            },
            deep: true
        }
    },
    methods: {
        lineRenderChart(){
            //fungsi untuk merender chart
            this.renderChart({
                labels: this.labels, //labelnya berdasarkan props label
                datasets: [{
                    label: 'Data Transaksi',
                    data: this.data, //data yang akan menjadi chart
                    backgroundColor: [
                         'rgba(255, 99, 132, 0.2)',
                         'rgba(54, 162, 235, 0.2)',
                         'rgba(255, 206, 86, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1
                }]
            }, this.options)
        }
    }
}
</script>
