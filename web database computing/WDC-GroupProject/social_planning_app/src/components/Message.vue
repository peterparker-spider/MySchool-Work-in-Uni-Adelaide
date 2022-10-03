<template>
    <transition name="fade">
        <div class="msg-box" v-if="showMsg">
            <div class="alert" :class="`alert-${theme}`" role="alert">
                {{ msg }}
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        theme: {
            type: String,
            default: 'info',
        },
        msg: {
            type: String,
            default: '',
        },
        duration: {
            type: Number,
            default: 2000,
        },
    },
    computed: {
        showMsg: {
            get() {
                return this.show;
            },
            set(val) {
                // this.show = val;
            },
        },
    },
    watch: {
        show: {
            handler(val) {
                if (val) {
                    setTimeout(() => {
                        this.showMsg = false;
                        console.log('watch---', this.showMsg);
                    }, this.duration);
                }
            },
            immediate: true,
        },
    },
    methods: {},
};
</script>

<style scoped>
.msg-box {
    max-width: 600px;
    position: fixed;
    top: 50px;
    z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>