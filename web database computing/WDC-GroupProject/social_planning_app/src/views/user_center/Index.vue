<template>
    <div class="signin-container d-flex justify-content-center">
        <div class="form-box shadow p-4 mb-4 bg-body">
            <h5 class="text-center form-title pb-4 mb-4">User Profile</h5>
            <form>
                <div class="row mb-4">
                    <div
                        class="
                            avatar-upload-box
                            position-relative
                            d-flex
                            justify-content-center
                            align-items-center
                            mb-2
                        "
                    >
                        <div
                            class="input-box position-relative"
                            :class="avatarUrl ? 'opacity-0' : ''"
                        >
                            <input
                                type="file"
                                accept="image/*"
                                id="file"
                                @change="handleChangeFile($event)"
                            />
                            <img src="@/assets/images/icon_upload.png" />
                        </div>

                        <div
                            class="avatar-box position-absolute shadow-sm"
                            v-if="avatarUrl"
                        >
                            <img :src="avatarUrl" />
                        </div>
                    </div>
                    <div class="col position-relative">
                        <label>First name</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Enter your first name"
                            v-model="firstName"
                        />
                        <p
                            class="error-msg position-absolute"
                            v-if="showFirstNameErr"
                        >
                            {{ firstNameErrMsg }}
                        </p>
                    </div>
                    <div class="col position-relative">
                        <label>Last name</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Enter your last name"
                            v-model="lastName"
                        />
                        <p
                            class="error-msg position-absolute"
                            v-if="showLastNameErr"
                        >
                            {{ lastNameErrMsg }}
                        </p>
                    </div>
                </div>
                <div class="mb-4 position-relative">
                    <label>Username</label>
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
                    <label>Email</label>
                    <input
                        type="email"
                        class="form-control"
                        placeholder="Enter your email"
                        v-model="email"
                    />
                    <p class="error-msg position-absolute" v-if="showEmailErr">
                        {{ emailErrMsg }}
                    </p>
                </div>

                <div class="d-grid gap-2">
                    <button
                        type="button"
                        class="btn btn-info border-radius-50"
                        :disabled="isLoading"
                        @click="handleBtnSave"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { postUserInfos_api } from '@/api/index';
import { delLogout_api } from '@/api/auth';
import { getObjectURL, getPictureBase64 } from '@/utils/util';
import { mapState } from 'vuex';

export default {
    name: 'UserCenter',
    data() {
        return {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            showFirstNameErr: false,
            firstNameErrMsg: 'First Name is incorrect',
            showLastNameErr: false,
            lastNameErrMsg: 'Last Name is incorrect',
            showUsernameErr: false,
            usernameErrMsg: 'Username is incorrect',
            showEmailErr: false,
            emailErrMsg: 'Email is incorrect',
            avatarUrl: '',
            base64Img: '',
            isLoading: false,
        };
    },
    computed: {
        ...mapState(['userInfo']),
    },
    created() {
        let userInfo = this.userInfo;
        this.avatarUrl = userInfo.image;
        this.firstName = userInfo.firstname;
        this.lastName = userInfo.lastname;
        this.username = userInfo.username;
        this.email = userInfo.email;
    },
    methods: {
        handleChangeFile(event) {
            console.log(event.target.files[0]);
            if (event.target.files[0]) {
                let fileObj = event.target.files[0];
                getPictureBase64(fileObj).then((res) => {
                    if (res) {
                        this.base64Img = res;
                    }
                });

                this.avatarUrl = getObjectURL(fileObj);
            } else {
                this.avatarUrl = '';
                this.base64Img = '';
            }
        },

        handleBtnSave() {
            if (this.firstName == '') {
                this.showFirstNameErr = true;
                return;
            } else {
                this.showFirstNameErr = false;
            }
            if (this.lastName == '') {
                this.showLastNameErr = true;
                return;
            } else {
                this.showLastNameErr = false;
            }
            if (this.username == '') {
                this.showUsernameErr = true;
                return;
            } else {
                this.showUsernameErr = false;
            }
            if (this.email == '') {
                this.showEmailErr = true;
                return;
            } else {
                this.showEmailErr = false;
            }

            let params = {
                username: this.username,
                firstname: this.firstName,
                lastname: this.lastName,
                email: this.email,
                image: this.base64Img,
            };

            this.isLoading = true;
            postUserInfos_api(params)
                .then((res) => {
                    this.isLoading = false;
                    if (res.code == 0) {
                        alert(
                            'Update user profile successfully! Please log in again.'
                        );
                        this.handleLogOut();
                    } else if (res.message) {
                        alert(res.message);
                    }
                })
                .catch((err) => {
                    this.isLoading = false;
                });
        },
        handleLogOut() {
            delLogout_api()
                .then((res) => {})
                .catch((err) => {});

            this.$router.replace('/login');
            this.$store.commit('setLoginStatus', false);
            localStorage.setItem('user_info', null);
        },
    },
};
</script>

<style scoped>
.signin-container {
    margin-top: 80px;
}

.form-box {
    width: 500px;
    border-radius: 6px;
}

.form-title {
    border-bottom: 2px solid #31d2f2;
}

.avatar-upload-box input[type='file'] {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 80px;
    cursor: pointer;
}
.avatar-upload-box .input-box {
    padding: 0px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    background-color: transparent;
    color: #fff;
    z-index: 2;
}

.avatar-upload-box .input-box img {
    width: 60px;
    height: 60px;
    margin-top: 10px;
}
.avatar-upload-box .upload-txt {
    font-size: 14px;
    color: #999;
}

.avatar-upload-box .avatar-box {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    z-index: 1;
}

.avatar-upload-box .avatar-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
