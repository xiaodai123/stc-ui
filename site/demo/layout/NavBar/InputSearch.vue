<template>
    <div style="display: flex;">
        <transition name='search-input'>
            <input v-if="isShow" ref="searchInput" @keyup.enter.native="searchContent" @blur="blurInputSearch" class="searchInput" type="text" placeholder="在文档中搜索..." v-model="inputValue"/>
        </transition>
        <stc-svg-icon style="margin-top: 9px;margin-left: 12px;cursor: pointer;" @click="clickSearchSvg" :name="type" fill="#454D58" width="16" height="16" />
    </div>
</template>
<script>
import Vue from 'vue';
import { Input } from 'element-ui';
Vue.use(Input);
export default {
    name: 'InputSearch',
    data() {
        return {
            inputValue: '',
            isShow: false,
            type: 'search'
        }
    },
    methods: {
        clickSearchSvg() {
            this.isShow = !this.isShow;
            this.type = this.isShow ? 'close' : 'search';
            if(this.type == 'search') {
                this.$nextTick(() => {
                    this.$refs.searchInput.focus();
                })
            }
        },
        blurInputSearch() {
            this.isShow = !this.isShow;
            this.type = 'search';
        },
        searchContent() {
            // Algolia DocSearch
        }
    }
}
</script>
<style>
.searchInput {
    border: unset;
    width: 340px;
    border-bottom: 1px solid #c1bbbb;
    height: 24px;
    background-color: inherit;
    text-indent: 12px;
    transition: opacity 3s;
}
.hideSearchSvg {
    visibility: hidden;
}
.search-input-enter-active, .search-input-leave-active {
  transition: opacity .5s
}
.search-input-enter, .search-input-leave-to{
  opacity: 0;
}
</style>
