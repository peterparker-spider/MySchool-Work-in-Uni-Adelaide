<template>
    <div class="login-container d-flex justify-content-center">
        <div class="form-box shadow p-4 mb-4 bg-body">
            <h5 class="text-center form-title pb-4 mb-4">Login your account</h5>
            <form>
                <div class="mb-4 position-relative">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Enter your username"
                        v-model="username"
                    />
                    <p
                        class="error-msg position-absolute"
                        v-if="showUsernameErr"
                    >
                        {{ usernameErrMsg }}
                    </p>
                </div>
                <div class="mb-4 position-relative">
                    <input
                        type="password"
                        class="form-control"
                        placeholder="Enter your password"
                        v-model="password"
                    />
                    <p
                        class="error-msg position-absolute"
                        v-if="showPasswordErr"
                    >
                        {{ passwordErrMsg }}
                    </p>
                </div>

                <div class="d-grid gap-2">
                    <button
                        type="button"
                        class="btn btn-info border-radius-50"
                        :disabled="isLoading"
                        @click="handleBtnLogin"
                    >
                        Log in
                    </button>
                    <div class="text-center">
                        <span>No account?</span>
                        <span
                            class="text-info mt-2 pointer"
                            @click="handleBtnSignUp"
                        >
                            Sign Up
                        </span>
                    </div>
                </div>
            </form>
        </div>
        <!-- <Message :show="showMsg" theme="danger" msg="test msg"></Message> -->
    </div>
</template>

<script>
import { postLogin_api } from '@/api/auth';
import Message from '@/components/Message';

export default {
    name: 'Login',
    data() {
        return {
            username: '',
            password: '',
            showUsernameErr: false,
            usernameErrMsg: 'Username is incorrect',
            showPasswordErr: false,
            passwordErrMsg: 'Password is incorrect',
            showMsg: false,
            redirectPath: '/',
            isLoading: false,
        };
    },
    components: { Message },
    created() {
        if (this.$route.query.redirect) {
            let query = this.$route.query;
            this.redirectPath = query.redirect;
        }

        if (this.$store.state.isLoginSuccess) {
            this.$router.replace('/');
        }
    },
    methods: {
        handleBtnLogin() {
            // this.showMsg = true;
            if (this.username == '') {
                this.showUsernameErr = true;
                return;
            } else {
                this.showUsernameErr = false;
            }
            if (this.password == '') {
                this.showPasswordErr = true;
                return;
            } else {
                this.showPasswordErr = false;
            }
            let params = {
                username: this.username,
                password: this.password,
            };
            this.isLoading = true;
            postLogin_api(params)
                .then((res) => {
                    this.isLoading = false;
                    if (res.code == 0) {
                        this.$store.commit('setUserInfo', res.user);
                        this.$store.commit('setLoginStatus', true);
                        localStorage.setItem(
                            'user_info',
                            JSON.stringify(res.user)
                        );
                        this.$router.replace(this.redirectPath);
                    } else if (res.message) {
                        alert(res.message);
                    }
                })
                .catch((err) => {
                    this.isLoading = false;
                });
        },
        handleBtnSignUp() {
            this.$router.push('/sign_up');
        },
    },
};
</script>

<style scoped>
.login-container {
    margin-top: 80px;
}

.form-box {
    width: 500px;
    border-radius: 6px;
}

.form-title {
    border-bottom: 2px solid #31d2f2;
}
</style>
