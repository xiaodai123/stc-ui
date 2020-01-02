<template>
    <el-breadcrumb separator="/">
        <transition-group name="breadcrumb">
            <template v-for="(item, index) in matchedList" :index="index">
                <el-breadcrumb-item v-if="item.meta && item.meta.title" :key="item.path">
                    <span v-if="item.redirect == 'noredirect' || index == matchedList.length - 1">{{ generateRouteTitle(item.meta.title) }}</span>
                    <router-link v-else :to="item.path">{{ generateRouteTitle(item.meta.title) }}</router-link>
                </el-breadcrumb-item>
            </template>
        </transition-group>
    </el-breadcrumb>
</template>
<script>
import Vue from 'vue';
import { Breadcrumb, BreadcrumbItem } from 'element-ui';
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
export default {
    name: 'BreadCrumb',
    methods: {},
    computed: {
        matchedList() {
            return this.$route.matched;
        }
    },
    mounted() {}
}
</script>