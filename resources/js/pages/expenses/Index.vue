<template>
    <div class="container">
        <section class="container">
            <h1>Atur Pengeluaran</h1>
            <breadcrumb></breadcrumb>
        </section>

        <section class="content">
            <div class="row">
                <router-view></router-view>
            </div>
        </section>
    </div>
</template>

<script>
import Breadcrumb from '../../components/Breadcrumb.vue'
export default {
    name: 'IndexExpenses',
    components: {
        'breadcrumb' : Breadcrumb
    }
    
}
</script>