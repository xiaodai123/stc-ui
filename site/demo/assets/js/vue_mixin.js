import Vue from 'vue';
Vue.mixin({
    mixins: [],
    data() {
        return {
            isMounted: true
        }
    },
    deactivated() {
        this.isMounted = false;
    },
    methods: {
        generateRouteTitle(title) {
            let name = 'route.' + title;
            if(!this.$te(name)) {
                return title;
            }
            return this.$t(name);
        }
    }
})