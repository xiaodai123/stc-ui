<template>
    <el-container data-main-layout-box>
        <!-- 左侧菜单 -->
        <el-aside class="main_aside">
            <SideBar/>
        </el-aside>
        <el-container class="main_container">
            <el-scrollbar class="main_scrollbar">
                <!-- 右侧顶部内容 -->
                <el-header class="main_header">
                    <NavBar />
                    <TagsView class="main_tags_view" />
                </el-header>
                <!-- 右侧显示主要内容 -->
                <el-main class="main_main">
                    <AppMain />
                </el-main>
            </el-scrollbar>
        </el-container>
    </el-container>
</template>
<script>
import Vue from 'vue';
import { Container, Aside, Scrollbar, Header, Main } from 'element-ui';
import SideBar from '@demo/layout/SideBar';
import NavBar from '@demo/layout/NavBar';
import TagsView from '@demo/layout/TagsView';
import AppMain from '@demo/layout/AppMain';
Vue.use(Container);
Vue.use(Aside);
Vue.use(Scrollbar);
Vue.use(Header);
Vue.use(Main)
export default {
    name: 'DefaultLayout',
    components: {
        SideBar,
        NavBar,
        TagsView,
        AppMain
    }
}
</script>
<style lang="scss">
.el-container[data-main-layout-box] {
    .main_aside {
        width: auto!important;
        height: 100vh;
        position: relative;
        z-index: 110;
    }
    .main_scrollbar {
        width: 100%;
        height: 100vh;
        background: #F3F6FA;
        & > .el-scrollbar__wrap {
            padding: 80px 20px;
            padding-bottom: 24px;
            overflow-x: hidden;
            box-sizing: border-box;
        }
        & > .el-scrollbar__bar.is-vertical {
            z-index: 101;
        }
    }
    .main_header {
        width: 100%;
        height: auto !important;
        background-color: #E7EDF5;
        padding-top: 10px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 100;
        .main_tags_view {
            margin-top: 5px;
        }
    }
    .main_main {
        padding: 0;
    }
}
</style>