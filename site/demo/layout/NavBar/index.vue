<template>
    <div class="clear_fix" data-nav-bar-box>
        <Hamburger class="hamburger_container" :toggle-click="toggleSideBar" :isActive="!$store.getters.isClose"></Hamburger>
        <BreadCrumb class="breadcrumb_container"></BreadCrumb>
        <ul class="right_bar">
            <li>
                <InputSearch></InputSearch>
            </li>
            <li>
                <SelectLang id="selectLang" class="selectlang_container"></SelectLang>
            </li>
        </ul>
    </div>
</template>
<script>
import Hamburger from '@demo/layout/NavBar/Hamburger';
import BreadCrumb from '@demo/layout/NavBar/BreadCrumb';
import SelectLang from '@demo/layout/NavBar/SelectLang';
import InputSearch from '@demo/layout/NavBar/InputSearch';
export default {
    name: 'NavBar',
    components: {
        Hamburger,
        BreadCrumb,
        SelectLang,
        InputSearch
    },
    methods: {
        toggleSideBar() {
            this.$store.commit('sideBar/TOGGLE_SIDEBAR')
        }
    }
}
</script>
<style lang="scss">
    $navBarHeight: 30px;
    div[data-nav-bar-box]{
        height: $navBarHeight;
        line-height: $navBarHeight;
        display: flex;
        align-items: center;
        
        .hamburger_container{
            height: $navBarHeight;
            line-height: $navBarHeight;
            // svg{
            //     vertical-align: top;
            // }
        }

        .breadcrumb_container{
            height: $navBarHeight;
            line-height: $navBarHeight;
            margin-left: 15px;
            font-size: 13px;
        }

        .right_bar{
            height: $navBarHeight;
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;
            li{
                height: $navBarHeight;
                line-height: $navBarHeight;
                padding: 0 15px;
                border-right: 1px #DBE4F0 solid;
                display: inline-block;
            }
        }
        
    }
</style>