<template>
    <button
        @click="handleClick"
        :disabled="disabled"
        :type="nativeType"
        :class="[
          'stc-button',
          type ? 'stc-button--' + type : '',
          buttonSize ? 'stc-button--' + buttonSize : '',
          {
            'is-disabled': disabled,
            'is-round': round,
            'is-circle': circle,
            'is-plain': plain
          }
        ]"
    >     
        <stc-svg-icon v-if="icon" :name=icon width="14" height="14" />
        <span v-if="$slots.default"><slot></slot></span>
    </button>
</template>
<script>
export default {
    name: 'stc-button',
    props: {
        type: {
            type: String,
            default: 'default'
        },
        size: String,
        nativeType: {
            type: String,
            default: 'button'
        },
        disabled: Boolean,
        round: Boolean,
        circle: Boolean,
        plain: Boolean,
        icon: String
    },
    computed: {
        buttonSize() {
            return this.size || (this.$ELEMENT || {}).size;
        }
    },
    methods: {
        handleClick(evt) {
            this.$emit('click', evt);
        }
    }
};
</script>
