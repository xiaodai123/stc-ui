<template>
    <div>
        <stc-svg-icon 
            class="hamburger"
            :class="{'is_active': isActive}"
            @click.native="toggleClick"
            :width="width"
            :height="height"
            name="hamburger-menu">
        </stc-svg-icon>
    </div>
</template>
<script>
export default {
    name: 'Hamburger',
    props: {
        width: {
            type: Number,
            default: 26
        },
        height: {
            type: Number,
            default: 26
        },
        isActive: {
            type: Boolean,
            default: true
        },
        toggleClick: {
            type: Function,
            default: null
        }
    }
}
</script>

<style lang="scss" scoped>
.hamburger {
    transition: transform .3s;
    transform: rotateZ(90deg);
    cursor: pointer;
    &.is_active {
        transform: rotateZ(0deg);
    }
}
</style>