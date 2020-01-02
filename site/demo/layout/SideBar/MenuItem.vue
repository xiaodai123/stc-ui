<template>
    <!-- 第一层路由中必需要有children子集，因为用到布局组件 -->
    <div class="menu_wrapper" v-if="!item.hidden && item.children">
        <el-menu-item v-if="hasOneChild(item.children) && !oneChild.children && !isIgnore && !item.alwaysShow" :index="getPath(oneChild.path)">
            <menu-title-icon :icon="oneChild.meta.icon" :title="generateRouteTitle(oneChild.meta.title)"></menu-title-icon>
        </el-menu-item>
        <el-submenu popper-class="menu_popper" v-else :index="item.path">
            <template slot="title">
                <menu-title-icon :icon="item.meta.icon" :title="generateRouteTitle(item.meta.title)"></menu-title-icon>
            </template>
            <template v-for="child in item.children">
                <menu-item v-if="child.children && child.children.length > 0" :isIgnore="true" :item="child" :parent-path="getPath(child.path)" :key="child.path"></menu-item>
                <el-menu-item v-else :index="getPath(child.path)" :key="child.path">
                    <!-- <span slot="title">{{child.meta.title}}</span> -->
                    <menu-title-icon :icon="child.meta.icon" :title="generateRouteTitle(child.meta.title)"></menu-title-icon>
                </el-menu-item>
            </template>
        </el-submenu>
    </div>
</template>
<script>
import Vue from 'vue';
import { MenuItem, Submenu } from 'element-ui';
import path from 'path';
Vue.use(MenuItem);
Vue.use(Submenu);
export default {
    name: 'MenuItem',
    data() {
        return {
            oneChild: null
        }
    },
    props: {
        // 是否忽略判断子菜单的长度，来展现父菜单
        isIgnore: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            required: true
        },
        parentPath: {
            type: String,
            default: ''
        }
    },
    methods: {
        hasOneChild(children) {
            const showChild = children.filter(item => {
                if(item.hidden) return false;
                else return true;
            })
            if(showChild.length == 1) {
                this.oneChild = showChild[0];
                return true;
            }
            return false;
        },
        getPath(currPath) {
            return path.resolve(this.parentPath, currPath);
        }
    },
    components: {
        MenuTitleIcon: {
            name: 'MenuTitleIcon',
            functional: true,
            props: {
                icon: {
                    type: String,
                    default: ''
                },
                title: {
                    type: String,
                    default: ''
                }
            },
            render(h, context) {
                const { icon, title } = context.props;
                const vnodes = [];
                if(icon) {
                    vnodes.push(<stc-svg-icon style="margin-right: 10px;" name={icon} />);
                }
                if(title) {
                    vnodes.push(<span slot="title" style="color: inherit;">{title}</span>);
                }
                return vnodes;
            }
        }
    }
}
</script>