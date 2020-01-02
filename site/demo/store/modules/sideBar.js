const namespaced = {
    namespaced: true
}

const state = {
    // 导航树结构数据
    data: [],
    // 导航平行结构数据
    dataParallel: [],
    isClose: false
}

// 调用函数改变state的值
const mutations = {
    SET_DATA(state, d) {
        state.data = d;
    },
    TOGGLE_SIDEBAR(state) {
        state.isClose = !state.isClose;
    }
}

const actions = {
    setData({ commit }, arr) {
        commit('SET_DATA', arr);
    }
}

export default {
    namespaced,
    state,
    mutations,
    actions
}