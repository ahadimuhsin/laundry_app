<template>
    <div class="container">
        <section class="content-header">
            <h1>Manage Outlets</h1>
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
//mengimpor komponen Breadcrumb untuk digunakan
import Breadcrumb from '../../components/Breadcrumb.vue'
export default {
name: "IndexOutlet",
    components: {
    'breadcrumb' : Breadcrumb //deklarasi komponen Breadcrumb ke tag breadcrumb
    }
}
</script>

