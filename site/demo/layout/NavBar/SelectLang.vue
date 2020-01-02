<template>
    <el-dropdown class="lang_dropdown" @command="selectLang" trigger="click" placement="bottom">
        <span class="el-dropdown-link">
            <!-- {{language}}<i class="el-icon-arrow-down el-icon--right"></i> -->
            <em>{{language}}</em>
            <stc-svg-icon name="triangle-down" width="8" height="8" />
        </span>
        <el-dropdown-menu slot="dropdown" class="custom_dropdown">
            <el-dropdown-item v-for="(value, key) in LANG" :key="key" :command="key" :disabled="language == key">{{value}}</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
import Vue from 'vue';
import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
export default {
    name: 'SelectLang',
    data() {
        return {
            LANG: this.$store.state.LANG
        }
    },
    computed: {
        language() {
            return this.$store.state.language;
        }
    },
    methods: {
        selectLang(val) {
            this.$i18n.locale = val;
            this.$store.commit('SET_LANGUAGE', val);
        }
    }
}
</script>
<style lang="scss" scoped>
    .lang_dropdown{
        cursor: default;
    }
</style>