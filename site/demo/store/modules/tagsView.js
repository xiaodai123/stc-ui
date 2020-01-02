const tagsView = {
    namespaced: true,
    state: {
        data: [],
        cacheData: [],
        closeData: []
    },
    mutations: {
        // 拖拽改变数据
        CHANGE_DATA(state, data) {
            state.data = data;
        },
        // 增加tag数据
        ADD_DATA(state, route) {
            state.data.push(
                Object.assign({}, route, {
                    title: route.meta.title || 'no-name'
                })
            )
        },
        // 增加缓存数据
        ADD_CACHE_DATA(state, route) {
            if (!route.meta.noCache) {
                if (!state.cacheData.includes(route.name)) {
                    state.cacheData.push(route.name);
                }
            }
        },
        // 增加关闭tag数据
        ADD_CLOSE_DATA(state, route) {
            // if (state.data.some(v => v.path == route.path)) return;
            if (!state.closeData.includes(route.path)) {
                state.closeData.push(route.path);
            }
        },
        // 删除tag数据
        DEL_DATA(state, route) {
            for (let [i, v] of state.data.entries()) {
                if(v.path == route.path) {
                    state.data.splice(i, 1);
                    break;
                }
            }
        },
        // 删除缓存数据
        DEL_CACHE_DATA(state, route) {
            let index = state.cacheData.indexOf(route.name);
            if(index != -1) {
                state.cacheData.splice(index, 1);
            }
        },
        // 删除关闭tag数据
        DEL_CLOSE_DATA(state, route) {
            for (let [i, v] of state.closeData.entries()) {
                if(v == route.path) {
                    state.closeData.splice(i, 1);
                    break;
                }
            }
        }
    },
    actions: {
        addData({ commit, state }, route) {
            if (state.data.some(v => v.path == route.path)) return;
            commit('ADD_DATA', route);
            commit('ADD_CACHE_DATA', route);
        },
        delData({ commit, state }, route) {
            return new Promise((resolve, reject) => {
                commit('DEL_DATA', route);
                commit('DEL_CACHE_DATA', route);
                resolve(state.data);
            })
        }
    }
};
export default tagsView