<template>
    <el-scrollbar class="sidebar_container">
        <div class="side_logo">
            <img style="transition: width .2s;" :class="{'hide_logo' : isClose}" src="@demo/assets/image/logo.png">
        </div>
        <el-menu 
            :class="{'hide_sidebar': isClose}"
            background-color="#34495E" text-color="#BFCBD9"
            :router="true" :default-active="$route.fullPath" :collapse="isClose">
            <menu-item v-for="(item, index) in routes" :key="index + ''" :item="item" :parent-path="item.path"></menu-item>
        </el-menu>
    </el-scrollbar>
</template>
<script>
import MenuItem from '@demo/layout/sidebar/MenuItem'
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Scrollbar, Menu } from 'element-ui';
import { routes } from '@demo/router/demo';
Vue.use(Scrollbar);
Vue.use(Menu);
export default {
    name: 'SideBar',
    data() {
        return {
            routes: routes
        }
    },
    computed: {
        ...mapGetters({
            'isClose': 'isClose'
        })
    },
    components: {
        MenuItem
    }
}
</script>
<style lang="scss">
@import './sideBar';
</style>