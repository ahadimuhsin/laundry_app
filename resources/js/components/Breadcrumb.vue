<template>
    <ol class="breadcrumb">
        <li><router-link :to="{name: 'home'}">
            <i class="fa fa-dashboard"></i>Home</router-link>
        <li class="active">{{$route.meta.title}}</li>
<!-- route.meta.title mengakses atribut meta.title dari route yang
telah didefinsikan pada file router.js-->
    </ol>
</template>

<script>
export default {

}
</script>
