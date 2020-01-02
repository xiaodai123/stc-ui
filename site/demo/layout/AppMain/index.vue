<template>
    <section class="app_main">
        <!-- <p>cacheData:</p>
        <p>{{cacheData}}</p><br />
        <p>closeData:</p>
        <p>{{closeData}}</p><br />
        <p>pathKey:</p>
        <p>{{pathKey}}</p> -->
        <transition name="fade-transform" mode="out-in">
             <!-- :include="cacheData" -->
            <keep-alive>
                <!-- https://cn.vuejs.org/v2/guide/transitions.html#多个元素的过渡 -->
                <!-- 当有相同标签名的元素切换时，需要通过 key 特性设置唯一的值来标记以让 Vue 区分它们，否则 Vue 为了效率只会替换相同标签内部的内容。 -->
                <router-view ref="appRouterView" :routeName="routeName" :key="key" v-if="isShow" />
            </keep-alive>
        </transition>
    </section>
</template>
<script>
import { Bus, Obj } from '@demo/assets/js/utils';
import { mapState } from 'vuex';
export default {
    name: 'AppMain',
    data() {
        return {
            // 路由的路径path及对应的缓存key, 例如：/index: '__transition-99-/index'
            pathKey: {},
            isShow: true
        }
    },
    computed: {
        ...mapState({
            cacheData: state => state.tagsView.cacheData,
            closeData: state => state.tagsView.closeData
        }),
        // 不能使用fullPath， 因为keep-alive根据key生成对应的缓存，fullPath可能后面会携带参数，这样会导致生成多个缓存，
        // 无法全部清除，使用 path 生成key
        key() {
            return this.$route.path;
        },
        // 设置路由name，可与cacheData进对比，确定是否缓存
        routeName() {
            return this.$route.name;
        }
    },
    watch: {
        $route() {
            this.getPathKey();
            // 二级以上的多个三级菜单中，因为缓存了二级，所有它的三级菜单都会被缓存，如果设置了某个三级菜单不缓存，则需要以下处理
            // 判断routeName在cacheData是否存在，不存在代表不缓存
            let appRouterView = this.$refs.appRouterView;
            if(Obj.isGet(appRouterView, '$vnode.data.attrs.routeName').is) {
                let routeName = appRouterView.$vnode.data.attrs.routeName;
                if(this.cacheData.some(v => v == routeName)) return;
                let path = Obj.isGet(appRouterView, '$vnode.data').is ? appRouterView.$vnode.data.key : undefined;
                let key = appRouterView.$vnode.key;
                this.clearKeepAlive(path, key);
            }
        }
        // closeData() {
        //     if(this.closeData.length > 0) {
        //         // this.getPathKey();
        //         let path = this.closeData[this.closeData.length - 1];
        //         let key = this.pathKey[path];
        //         this.clearKeepAlive(path, key);
        //     }
        // }
    },
    mounted() {
        this.getPathKey();
        // 监听是否刷新当前路由
        Bus.$on('refreshRoute', () => {
            this.refreshRoute();
        })
    },
    methods: {
        // 获取上一次路由的路径path及对应的缓存key，例如：/index: '__transition-99-/index'
        // key：生成的keep-alive的key名 -> '__transition-76-/index'；$vnode.key中获取
        // path：绑定在router-view的key名 -> '/index'；$vnode.data.key中获取，实际在computed中的key函数生成
        getPathKey() {
            let appRouterView = this.$refs.appRouterView;
            if(Obj.isGet(appRouterView, '$vnode.parent.componentInstance').is) {
                let path = Obj.isGet(appRouterView, '$vnode.data').is ? appRouterView.$vnode.data.key : undefined;
                let key = appRouterView.$vnode.key;
                this.pathKey[path] = key;
            }
        },
        // 每次关闭tag或新增tag时，判断closeData进行对应的keep-alive清除
        // 概述逻辑：每次关闭tag或新增tag时，根据当前的key和path，匹配cache和keys，删除对应缓存数据
        // cache：keep-alive中的缓存数据 -> {__transition-76-/index: VNode};  $vnode.parent.componentInstance.cache中获取
        // keys：keep-alive中的缓存数据的key值数组 -> ['__transition-76-/index'];  $vnode.parent.componentInstance.keys中获取
        clearKeepAlive(path, key) {
            let appRouterView = this.$refs.appRouterView;
            let cache, keys;
            if(Obj.isGet(appRouterView, '$vnode.parent.componentInstance').is) {
                cache = appRouterView.$vnode.parent.componentInstance.cache;
                keys = appRouterView.$vnode.parent.componentInstance.keys;
            }
            // if(this.closeData.some(v => v == path) && cache) {
            if(cache) {
                if (cache[key]) {
                    if (keys.length) {
                        let index = keys.indexOf(key);
                        if (index > -1) {
                            keys.splice(index, 1);
                        }
                    }
                    cache[key].componentInstance.$destroy();
                    cache[key] = null;
                    // delete this.pathKey[path];
                }
            }
        },
        // 刷新当前路由(数据重置，如果要重置vuex数据， 请在配置路由时，配置meta.storeName, 并在对应vuex文件中写入CLEAR_DATA方法重置数据)
        refreshRoute() {
            // 清除当前路由对应的vuex数据
            let route = this.$route;
            if(route.meta && route.meta.storeName) {
                if(this.$store._mutations[`${route.meta.storeName}/CLEAR_DATA`]) {
                    this.$store.commit(`${route.meta.storeName}/CLEAR_DATA`);
                }
            }
            // 删除缓存数据、添加关闭数据
            this.$store.commit('tagsView/DEL_CACHE_DATA', route);
            this.$store.commit('tagsView/ADD_CLOSE_DATA', route);
            // 记录path、key到pathKey对象中
            this.getPathKey();
            // 当前keep-alive清除
            let path = this.closeData[this.closeData.length - 1];
            let key = this.pathKey[path];
            this.clearKeepAlive(path, key);
            // 当前router-view组件销毁
            this.isShow = false;
            // dom渲染完后，并在setTimeout后，重新渲染router-view组件
            this.$nextTick(() => {
                setTimeout(() => {
                    // 添加缓存数据、删除关闭数据
                    this.$store.commit('tagsView/ADD_CACHE_DATA', route);
                    this.$store.commit('tagsView/DEL_CLOSE_DATA', route);
                    this.isShow = true;
                }, 600)
            })
        }
    }
}
</script>
<style lang="scss">
.app_main{
    position: relative;
    overflow: hidden;
    padding: 20px;
    & > section {
        a {
            color: #41a259;
            text-decoration: none;
        }
        h1 {
            color: #0d1a26;
            font-weight: 500;
            margin-bottom: 20px;
            margin-top: 8px;
            font-size: 30px;
            line-height: 38px;
        }
        h2, h3, h4, h5, h6 {
            font-family: Lato;
            margin: 1.6em 0 0.6em;
            font-weight: 500;
            clear: both;
        }
        h3 {
            font-size: 18px;
        }
        h4 {
            font-size: 16px;
        }
        h5 {
            font-size: 14px;
        }
        h6 {
            font-size: 12px;
        }
        p, pre {
            font-size: 14px;
            color: #5e6d82;
            line-height: 1.5em;
        }
        ul > li > p,
        ol > li > p {
            margin: 0.2em 0;
        }
        ul {
            padding: 0;
            margin: 0;
        }
        ul > li {
            list-style-type: circle;
            margin-left: 20px;
            padding-left: 4px;
            padding-top: 15px;
        }
        ol > li {
            list-style-type: decimal;
            margin-left: 20px;
            padding-left: 4px;
            padding-top: 15px;
            pre {
                background: #e0dcdc;
                border-radius: 10px;
                border: 1px solid #e0dcdc;
            }
        }
        .svg-list {
            list-style: none;
            display: flex;
            flex-flow: wrap;
            li {
                list-style-type: none;
                width: 85px;
                display: flex;
                flex-flow: column;
                align-items: center;
                height: 70px;
                margin: 5px 0px;
                border: 1px solid #d8dce0;
                span {
                    height: 35px;
                    text-align: center;
                    font-size: 14px;
                }
                .svg-name {
                    word-break: break-all;
                    width: 90%;
                    display: inline-block;
                }
            }
        }
        table {
            border-collapse: collapse;
            border-spacing: 0;
            empty-cells: show;
            border: 1px solid #ebedf0;
            width: 100%;
            margin: 8px 0 16px;
        }
        table th,
        table td {
            color: #314659;
            border: 1px solid #ebedf0;
            text-align: left;
            padding: 10px 15px;
        }
        table th {
            white-space: nowrap;
            color: #5c6b77;
            font-weight: 500;
            background: rgba(0, 0, 0, 0.02);
        }
        strong,
        b {
            font-weight: 500;
        }
        .sh-markdown-permalink {
            opacity: 0;
        }
        h1:hover .sh-markdown-permalink,
        h2:hover .sh-markdown-permalink,
        h3:hover .sh-markdown-permalink,
        h4:hover .sh-markdown-permalink,
        h5:hover .sh-markdown-permalink,
        h6:hover .sh-markdown-permalink {
            opacity: 1;
            display: inline-block;
        }
        br,
        p > br {
            clear: both;
        }
        blockquote {
            font-size: 90%;
            color: #0d1a26;
            border-left: 4px solid #ebedf0;
            padding-left: 0.8em;
            margin: 1em 0;
        }
        blockquote p {
            margin: 0;
        }
        hr {
            height: 1px;
            border: 0;
            background: #ebedf0;
            clear: both;
        }
        code {
            font-family: Microsoft YaHei;
            margin: 0 1px;
            background: #e6effb;
            padding: 0.2em 0.5em;
            border-radius: 3px;
            font-size: 0.9em;
            border: 1px solid #eee;
        }
        pre code {
            font-family: Microsoft YaHei;
            margin: unset;
            background: unset;
            padding: unset;
            border-radius: unset;
            font-size: unset;
            border: unset;
        }
    }
}
</style>