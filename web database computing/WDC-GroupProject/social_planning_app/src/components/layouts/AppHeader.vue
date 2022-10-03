<template>
    <div class="header px-4">
        <div class="container-fluid h-100">
            <div
                class="d-flex justify-content-between align-items-center h-100"
            >
                <router-link to="/" class="logo-link d-flex align-items-center">
                    <img
                        class="logo"
                        src="@/assets/images/logo.png"
                        alt="logo"
                    />
                    <p class="app-title">SOCIAL PLANNING</p>
                </router-link>
                <div class="btns-box d-flex pointer">
                    <template v-if="isLoginSuccess">
                        <div
                            class="dropdown position-relative"
                            @mouseenter="isShowDropdown = true"
                            @mouseleave="isShowDropdown = false"
                        >
                            <img
                                class="icon-avatar shadow-sm mx-3"
                                :src="userInfo.image"
                                v-if="userInfo.image"
                            />
                            <img
                                class="icon-avatar shadow-sm mx-3"
                                src="@/assets/images/icon_default_avatar.png"
                                v-else
                            />

                            <ul
                                class="dropdown-menu"
                                :class="isShowDropdown ? 'd-block' : 'd-none'"
                            >
                                <li>
                                    <a
                                        class="dropdown-item"
                                        @click="$router.push('/user_center')"
                                        >User profile</a
                                    >
                                </li>
                                <li>
                                    <a
                                        class="dropdown-item"
                                        @click="handleLogOut"
                                        >Log out</a
                                    >
                                </li>
                            </ul>
                        </div>

                        <img
                            class="icon-calendar"
                            src="@/assets/images/icon_calendar.png"
                            @click="
                                $route.path !== '/calendar' &&
                                    $router.push('/calendar')
                            "
                        />

                        <div
                            class="mx-3"
                            @click="
                                $route.path !== '/manage' &&
                                    $router.push('/manage')
                            "
                            v-if="userInfo.is_manager"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="38"
                                height="38"
                                fill="currentColor"
                                class="bi bi-telegram text-info"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"
                                />
                            </svg>
                        </div>
                    </template>
                    <template v-else>
                        <button
                            type="button"
                            class="btn btn-outline-info mx-3"
                            @click="
                                $route.path !== '/login' &&
                                    $router.push('/login')
                            "
                        >
                            Log in
                        </button>
                        <button
                            type="button"
                            class="btn btn-outline-dark"
                            @click="
                                $route.path !== '/sign_up' &&
                                    $router.push('/sign_up')
                            "
                        >
                            Sign Up
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { delLogout_api } from '@/api/auth';

export default {
    name: 'AppHeader',
    data() {
        return {
            isShowDropdown: false,
        };
    },
    computed: {
        ...mapState(['isLoginSuccess', 'userInfo']),
    },
    mounted() {},
    methods: {
        handleLogOut() {
            delLogout_api()
                .then((res) => {})
                .catch((err) => {});

            this.$router.replace('/login');
            this.$store.commit('setLoginStatus', false);
            localStorage.setItem('user_info', null);
            this.isShowDropdown = false;
        },
    },
};
</script>

<style scoped>
.header {
    height: 80px;
    position: fixed;
    top: 0;
    z-index: 10;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #f2f2f2;
}

.logo-link {
    display: inline-block;
}

.logo {
    height: 40px;
}

.icon-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 0 5px #f2f2f2;
}

.icon-calendar {
    width: 40px;
    cursor: pointer;
}

.app-title {
    font-size: 24px;
    font-weight: bold;
    margin-left: 10px;
}

.btns-box > button {
    border-radius: 50px;
}

.btns-box .dropdown-menu {
    min-width: 120px;
    left: -30px;
}

.slide-fade-enter-active {
    transition: all 0.2s ease;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}
</style>
