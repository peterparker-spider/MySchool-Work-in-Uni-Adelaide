<template>
    <div class="app-layout">
        <div class="app-container">
            <app-header></app-header>
            <div class="app-main">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from './AppHeader';
export default {
    components: {
        AppHeader,
    },
};
</script>

<style scoped>
.app-container {
    overflow: auto;
}

.app-main {
    background: #fff;
    min-height: calc(100vh - 80px);
    margin-top: 80px;
    padding: 40px 100px;
}
</style>