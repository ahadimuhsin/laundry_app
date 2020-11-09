<template>
    <div class="container">
        <section class="content-header">
            <h1>
                Atur Transaksi
            </h1>
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
import Breadcrumb from '../../components/Breadcrumb'
export default {
    name: 'IndexTransaction',
    components: {
        'breadcrumb': Breadcrumb
    }
}
</script>