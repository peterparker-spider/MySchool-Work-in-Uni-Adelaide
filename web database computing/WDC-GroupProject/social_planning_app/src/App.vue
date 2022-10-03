<template>
    <div id="app">
        <Layouts></Layouts>
    </div>
</template>

<script>
import Layouts from '@/components/layouts/Index';
import '@/assets/css/reset.css';
import '@/assets/css/common.css';

export default {
    name: 'App',
    components: {
        Layouts,
    },
    created() {
        let userInfo = JSON.parse(localStorage.getItem('user_info'));
        if (userInfo) {
            this.$store.commit('setLoginStatus', true);
            this.$store.commit('setUserInfo', userInfo);
        }

        if (sessionStorage.getItem('store')) {
            this.$store.replaceState(
                Object.assign(
                    {},
                    this.$store.state,
                    JSON.parse(sessionStorage.getItem('store'))
                )
            );
        }

        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('store', JSON.stringify(this.$store.state));
        });

        sessionStorage.removeItem('store');
    },
};
</script>

<style>
</style>
