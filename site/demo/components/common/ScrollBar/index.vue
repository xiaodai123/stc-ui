<template>
    <el-scrollbar
        ref="scrollbar"
        :native="native"
        :wrapStyle="wrapStyle"
        :wrapClass="wrapClass"
        :viewStyle="viewStyle"
        :viewClass="viewClass"
        :noresize="noresize"
        :tag="tag"
        :style="{ height: minheight ? minheight + 'px' : '' }">
        <slot></slot>
    </el-scrollbar>
</template>
<script>
import Vue from 'vue';
import { Scrollbar } from 'element-ui';
Vue.use(Scrollbar);
import ResizeObserver from 'resize-observer-polyfill';
export default {
    name: 'ScrollBar',
    props: {
        // el-scrollbar的props
        native: Boolean,
        wrapStyle: {},
        wrapClass: {},
        viewStyle: {},
        viewClass: {},
        noresize: Boolean, // 如果container尺寸不会发生变化，最好设置它可以优化性能
        tag: {
            type: String,
            default: 'div'
        },
        // 自定义的props
        horizontalSlide: Boolean, // 是否启用鼠标滚轮滚动时，scrollbar的横向滚动条进行滑动
        minHeight: Number,
        maxHeight: Number
    },
    data() {
        return {
            translateX: 0,
            minheight: this.minHeight,
            maxheight: this.maxHeight
        }
    },
    methods: {
        // 获取滚动条组件
        /**
         * horizontal - H
         * vertical - V
         */
        getBar(type = '') {
            let bar = null;
            bar = this.$refs.scrollbar.$children.find(item => {
                return item.$el.className == 'el-scrollbar__bar is-' + String.prototype.toLowerCase.call(type) + 'orizontal';
            })
            return bar;
        },
        // 监听内容改变
        resizeHandler(entries) {
            for(let entry of entries) {
                const listeners = entry.target.__resizeListeners__ || [];
                if(listeners.length) {
                    listeners.forEach(fn => {
                        fn();
                    })
                }
            }
        },
        addResizeListener(element, fn) {
            const isServer = typeof window === 'undefined';
            if(isServer) return;
            if(!element.__resizeListeners__) {
                element.__resizeListeners__ = [];
                element.__ro__ = new ResizeObserver(this.resizeHandler);
                element.__ro__.observe(element);
            }
            element.__resizeListeners__.push(fn);
        },
        removeResizeListener(element, fn) {
            if(!element || !element.__resizeListeners__) return;
            element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
            if(!element.__resizeListeners__.length) {
                element.__ro__.disconnect();
            }
        },
        hasRootElement(ele) {
            if(Array.from(ele).length > 1) {
                throw new Error('ScrollBar component should contain exactly one root element. If you are using v-if on multiple elements, use v-else-if to chain them instead.');
            }
            return Array.from(ele)[0];
        },
        // 为了适配全局替换的ElSelect组件调用scrollbar的方法
        handleScroll() {
            this.$refs.scrollbar && this.$refs.scrollbar.handleScroll();
        }
    },
    mounted() {
        let self = this;
        // 判断是否传入maxheight，设置内容最大高度值
        if(this.maxheight) {
            this.$nextTick(() => {
                let scrollbar = this.refs.scrollbar;
                let wrap = scrollbar.$el.querySelector('.el-scrollbar__wrap');
                let contentElem = wrap.querySelectorAll('.el-scrollbar__view > *');
                contentElem = this.hasRootElement(contentElem);
                let vertical = this.getBar('V');
                if(scrollbar.$el.style.height) {
                    this.minheight = Number(scrollbar.$el.style.height.replace('px', ''))
                }
                this.addResizeListener(contentElem, () => {
                    vertical.$el.style.visibility = 'hidden';
                    setTimeout(() => {
                        // 判断内容高度是否小于设置最大高度maxheight
                        if(contentElem.offsetHeight < this.maxheight) {
                            if(contentElem.offsetHeight > scrollbar.$el.offsetHeight) {
                                scrollbar.$el.style.height = (contentElem.offsetHeight + 40) + 'px';
                            }
                            if(this.minheight && contentElem.offsetHeight < this.minheight) {
                                scrollbar.$el.style.height = this.minheight ? this.minheight + 'px' : '';
                            }else {
                                scrollbar.$el.style.height = (contentElem.offsetHeight + 40) + 'px';
                            }
                        }else if(contentElem.offsetHeight > this.maxheight) { // 内容高度是否大于设置最大高度maxheight
                            scrollbar.$el.style.height = this.maxheight + 'px';
                        }else {
                            scrollbar.$el.style.height = this.minheight ? this.minheight + 'px' : '';
                        }
                        vertical.$el.style.visibility = 'visible';
                    }, 0)
                });
            })
        }
        // 横向滚动条，滑轮滚动效果
        if(!self.horizontalSlide) return;
        this.$nextTick(() => {
            // 获取el-scrollbar组件
            let scrollbar = self.$refs.scrollbar;
            // 获取wrap元素
            let wrap = scrollbar.$el.querySelector('.el-scrollbar__wrap');
            // 获取加载的内容元素（view里的内容）
            let contentElem = wrap.querySelectorAll('.el-scrollbar__view > *');
            // 判断ScrollBar是否只包含一个根元素,并返回当前元素
            contentElem = self.hasRootElement(contentElem);
            // 获取横向滚动条组件
            let horizontalBar = self.getBar('H');
            // 监听加载的内容元素尺寸改变，如果改变调用el-scrollbar里的更新方法（update）加载出滚动条
            self.addResizeListener(contentElem, scrollbar.update);
            // 监听wrap中的滚轮滚动事件
            let scrollFun = function(e) {
                // 如果横向滚动条为0时，不需要进行计算横向滚动
                if(horizontalBar.$refs.thumb.offsetWidth == 0) {
                    return -1;
                }
                e.stopImmediatePropagation();
                // wrap元素的宽度
                let wrapV = wrap.clientWidth - 17;
                // 横向滚动条的父级宽度
                let barParentW = horizontalBar.$el.offsetWidth;
                // 横向滚动条的子级宽度
                let barChildW = horizontalBar.$refs.thumb.offsetWidth;
                // 横向滚动条的子级translateX的最大百分比
                let percent = (barParentW - barChildW) / barChildW * 100;
                // 鼠标滚轮，滚动距离
                let mouseClientY = e.clientY / 0.9;
                // 防止用鼠标点击右键进行拖拽横向滚动条来改变translateX的值，每次判断上一次的translateX值，重新赋值给this.translateX
                // console.log(horizontalBar.$refs.thumb.style.transform.replace('translateX(', '').replace('%)', ''));
                let preTranslate = horizontalBar.$refs.thumb.style.transform.replace('translateX(', '').replace('%)', '');
                self.translateX = preTranslate / 100 * wrapV;
                // 滚轮向下滚动(火狐下使用detail判断)
                if(e.deltaY > 0 || e.detail > 0) {
                    // 判断计算横向滚动条，滑动最大距离
                    if(((self.translateX + mouseClientY) * 100) / wrapV > percent) {
                        self.translateX = percent / 100 * wrapV;
                    }else {
                        self.translateX += mouseClientY
                    }
                }else { // 滚轮向上滚动
                    // 判断计算横向滚动条，滑动最小距离
                    if(self.translateX - mouseClientY < 0) {
                        self.translateX = 0;
                    }else {
                        self.translateX -= mouseClientY;
                    }
                }
                // 设置横向滚动条的子级移动百分比（改变css的translateX值）
                scrollbar.moveX = ((self.translateX * 100) / wrapV);
                // horizontalBar.$refs.thumb.style.transform = `translateX(${(self.translateX * 100) / wapW}%)`;
                // 设置wap元素的scrollLeft数值，来移动加载的内容元素
                let num = (e.deltaY < 0 || e.detail < 0) ? 10 : 0; // 滚轮上滑时，减去一部分数值
                let scrollLeft = (((self.translateX * 100) / wrapV) / percent) * (contentElem.offsetWidth - wrapV) - num;
                wrap.scrollLeft = scrollLeft;
            }
            if(wrap.addEventListener){ // 火狐使用DOMMouseScroll监听滚轮事件
                wrap.addEventListener('DOMMouseScroll', scrollFun, false);
            }
            wrap.onmousewheel = scrollFun;
        })
    }
}
</script>