<template>
    <div class="tags_view">
        <ScrollBar horizontalSlide viewClass="clear_fix">
            <draggable class="drag_box" v-model="dragTagsData">
                <el-tag
                    :class="{'active': isActive(tag)}"
                    :key="tag.path"
                    v-for="tag in tagsData"
                    closable
                    :disable-transitions="false"
                    @close="closeTag(tag)">
                    <i class="refresh_icon" v-if="isActive(tag)" @click.stop="refreshCurrRoute" ref="refresh">
                        <stc-svg-icon name="refresh" fill="#454D58" width="12" height="12" />
                    </i>
                    <router-link :to="tag.path">{{ generateRouteTitle(tag.meta.title) }}</router-link>
                </el-tag>
            </draggable>
        </ScrollBar>
    </div>
</template>
<script>
import { Bus } from '@demo/assets/js/utils';
import Vue from 'vue';
import { mapGetters } from 'vuex';
import ScrollBar from '@demo/components/common/ScrollBar';
import draggable from 'vuedraggable';
import { Tag } from 'element-ui';
Vue.use(Tag);
export default {
    name: 'TagsView',
    components: {
        ScrollBar,
        draggable
    },
    computed: {
        ...mapGetters({
            'tagsData': 'tagsData'
        }),
        // 拖拽时改变数据
        dragTagsData: {
            get() {
                return this.tagsData;
            },
            set(val) {
                this.$store.commit('tagsView/CHANGE_DATA', val);
            }
        }
    },
    watch: {
        $route() {
            this.addTag();
        }
    },
    methods: {
        addTag() {
            if(!this.$route.name) return -1;
            let currRoute = this.$route;
            // 新增tag时，删除对应关闭数据
            this.$store.commit('tagsView/DEL_CLOSE_DATA', currRoute);
            this.$store.dispatch('tagsView/addData', currRoute).then(d => {
                // 二级以上菜单时，往缓存数据中加入name
                let matched = this.$route.matched;
                if(matched.length >= 3) {
                    for(let i = 1; i <= matched.length - 2; i++) {
                        this.$store.commit('tagsView/ADD_CACHE_DATA', matched[i])
                    }
                }
            })
        },
        closeTag(route) {
            // 判断是否清除当前路由对应的vuex数据
            if(route.meta && route.meta.storeName) {
                if(this.$store._mutations[`${route.meta.storeName}/CLEAR_DATA`]) {
                    this.$store.commit(`${route.meta.storeName}/CLEAR_DATA`);
                }
            }

            // 删除vuex中 data、cacheData 的对应数据
            this.$store.dispatch('tagsView/delData', route).then(tagsList => {
                // console.log(tagsList);
                // 关闭tag时，往closeData添加数据(暂时添加的是路由的path值)
                this.$store.commit('tagsView/ADD_CLOSE_DATA', route);
                // 如果关闭的是当前标签页，跳转到其他标签页
                if(this.isActive(route)) {
                    let lastRoute = tagsList.slice(-1)[0];
                    if(lastRoute) {
                        this.$router.push(lastRoute);
                    }else {
                        this.$router.push('/');
                        this.addTag();
                    }
                }
            })
        },
        isActive(route) {
            return route.path == this.$route.path;
        },
        refreshCurrRoute() {
            Bus.$emit('refreshRoute');
            let refresh = this.$refs.refresh[0];
            refresh.classList.add('refresh_icon_anim');
            setTimeout(() => {
                refresh.classList.remove('refresh_icon_anim');
            }, 1000)
        }
    },
    mounted() {
        this.addTag();
    }
}
</script>
<style lang="scss">
    .tags_view{
        .el-scrollbar{
            height: 34px;
            margin-bottom: -2px;
            .el-scrollbar__wrap{
                overflow-x: hidden;
            }
        }

        .drag_box{
            display: flex;
            float: left;
            white-space: nowrap;
        }

        .el-tag{
            display: flex;
            align-items: center;
            height: 32px;
            margin-right: 4px;
            padding: 0;
            background: rgba(136, 152, 172, 0.08);
            border-radius: 4px 4px 0px 0px;
            border: 1px solid #dbe4f0;
            border-bottom: none;

            a{
                padding: 0 10px;
                color: #8898AC;
            }

            .el-tag__close{
                position: static;
                background-color: rgba(255, 255, 255, 0.45);
                border-radius: 2px;
                color: #8898AC;
                margin-right: 8px;
                cursor: default;
            }
        }

        .el-tag.active{
            background: #F3F6FA;
            border: 1px solid #F3F6FA;
            a {
                color: #454D58;
            }

            .refresh_icon{
                margin-left: 8px;
                cursor: default;
                svg{
                    display: block;
                }
            }
            .refresh_icon_anim{
                transition: transform 1s ease-in-out;   
                transform: rotate(720deg);
            }
        }
    }
</style>