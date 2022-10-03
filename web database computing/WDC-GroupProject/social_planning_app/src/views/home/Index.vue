<template>
    <div class="home-container container-fluid">
        <div class="d-flex justify-content-end my-4 mt-0">
            <button
                type="button"
                class="btn btn-info border-radius-50"
                @click="handleBtnCreate"
            >
                + Create new event
            </button>
        </div>
        <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            <div
                class="col"
                v-for="(item, index) in eventsList"
                :key="'eventsList' + index"
            >
                <div class="card shadow-sm">
                    <div
                        class="
                            card-img-box
                            border-bottom
                            d-flex
                            align-items-end
                        "
                    >
                        <img
                            :src="item.image"
                            class="card-img-top"
                            v-if="item.image"
                        />
                        <img
                            class="card-img-top icon-default-img"
                            src="@/assets/images/icon_default_img.png"
                            v-else
                        />
                    </div>
                    <div class="card-body">
                        <h5 class="card-title text-truncate">
                            {{ item.name }}
                        </h5>
                        <p class="card-text text-truncate">
                            {{ item.description }}
                        </p>
                        <p class="card-text text-truncate">
                            {{ item.tag_time }}
                        </p>

                        <button
                            type="button"
                            class="
                                btn btn-outline-info btn-sm
                                border-radius-50
                                my-2
                            "
                            @click.stop="handleBtnInvite(item.id)"
                        >
                            Invite peoples
                        </button>
                        <button
                            type="button"
                            class="
                                btn btn-outline-secondary btn-sm
                                border-radius-50
                                mx-3
                                my-2
                            "
                            @click.stop="handleBtnView(item.id)"
                        >
                            View details
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- new event -->
        <transition name="fade">
            <div v-if="isShowNewEventDialog">
                <div class="modal">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Creating the event</h5>
                                <button
                                    type="button"
                                    class="btn-close"
                                    @click.self="isShowNewEventDialog = false"
                                ></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3 position-relative">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        v-model="eventForm.name"
                                        class="form-control"
                                        placeholder="Enter the event name"
                                    />
                                    <p
                                        class="error-msg position-absolute"
                                        v-if="showNameErr"
                                    >
                                        {{ nameErrMsg }}
                                    </p>
                                </div>
                                <div class="mb-3 position-relative">
                                    <label>Description</label>
                                    <textarea
                                        class="form-control"
                                        v-model="eventForm.description"
                                        placeholder="Enter the event description"
                                        rows="2"
                                    ></textarea>
                                    <p
                                        class="error-msg position-absolute"
                                        v-if="showDespErr"
                                    >
                                        {{ despErrMsg }}
                                    </p>
                                </div>
                                <div class="mb-3 position-relative">
                                    <label>Time</label>
                                    <DatePicker
                                        type="datetime"
                                        name="start_time"
                                        class="date-picker-box w-100"
                                        v-model="eventForm.time"
                                        format="YYYY-MM-DD HH:mm"
                                        :show-time-header="true"
                                        placeholder="Enter the event time"
                                    />
                                    <p
                                        class="error-msg position-absolute"
                                        v-if="showTimeErr"
                                    >
                                        {{ timeErrMsg }}
                                    </p>
                                </div>
                                <div class="position-relative">
                                    <label>Picture</label>
                                    <div
                                        class="
                                            upload-box
                                            position-relative
                                            d-flex
                                            justify-content-start
                                            align-items-center
                                        "
                                    >
                                        <div
                                            class="
                                                input-box
                                                position-relative
                                                text-center
                                            "
                                            :class="
                                                eventForm.picture
                                                    ? 'opacity-0'
                                                    : ''
                                            "
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="file"
                                                @change="
                                                    handleChangeFile($event)
                                                "
                                            />

                                            <img
                                                src="@/assets/images/icon_default_img.png"
                                            />
                                        </div>

                                        <div
                                            class="img-box position-absolute"
                                            v-if="eventForm.picture"
                                        >
                                            <img :src="eventForm.picture" />
                                        </div>
                                        <div>
                                            <p class="upload-txt">
                                                Upload photo as event picture
                                            </p>
                                            <p class="upload-txt">
                                                Suggested size: 240 x 120
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button
                                    type="button"
                                    class="
                                        btn btn-outline-secondary
                                        border-radius-50
                                    "
                                    @click.self="isShowNewEventDialog = false"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-info border-radius-50"
                                    @click="handleBtnSub"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- event detail -->
        <transition name="fade">
            <div v-if="isShowViewDialog">
                <div class="modal">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Event details</h5>
                                <button
                                    type="button"
                                    class="btn-close"
                                    @click.self="closeDetailDialog"
                                ></button>
                            </div>
                            <div class="modal-body">
                                <img
                                    class="img-fluid w-100 my-2 shadow-sm"
                                    :src="eventDetails.image"
                                />
                                <h4>{{ eventDetails.name }}</h4>
                                <p class="my-2">
                                    {{ eventDetails.description }}
                                </p>
                                <span class="badge bg-dark my-2">{{
                                    eventDetails.tag_time
                                }}</span>
                                <div class="d-flex flex-wrap">
                                    <div
                                        class="event-user-box my-2 px-2"
                                        v-for="(user, index) in eventUsers"
                                        :key="'eventUsers' + index"
                                    >
                                        <img
                                            class="user-avatar shadow-sm"
                                            :src="user.image"
                                            v-if="user.image"
                                        />
                                        <img
                                            class="user-avatar"
                                            src="@/assets/images/icon_default_avatar.png"
                                            v-else
                                        />
                                        <p
                                            class="
                                                w-100
                                                text-center text-truncate
                                            "
                                        >
                                            {{ user.username }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button
                                    type="button"
                                    class="btn btn-info border-radius-50"
                                    @click.self="closeDetailDialog"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- invite peoples -->
        <transition name="fade">
            <div v-if="isShowInviteDialog">
                <div class="modal">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Inviting the people</h5>
                                <button
                                    type="button"
                                    class="btn-close"
                                    @click.self="isShowInviteDialog = false"
                                ></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3 position-relative">
                                    <div
                                        class="
                                            form-check form-check-inline
                                            px-4
                                        "
                                        v-for="(user, index) in usersList"
                                        :key="'usersList' + index"
                                    >
                                        <input
                                            class="form-check-input my-3"
                                            type="checkbox"
                                            :id="'inlineCheckbox' + index"
                                            :value="user.id"
                                            v-model="users"
                                        />
                                        <label
                                            class="form-check-label"
                                            :for="'inlineCheckbox' + index"
                                        >
                                            <img
                                                class="user-avatar shadow-sm"
                                                :src="user.image"
                                                v-if="user.image"
                                            />
                                            <img
                                                class="user-avatar"
                                                src="@/assets/images/icon_default_avatar.png"
                                                v-else
                                            />
                                            <span> {{ user.username }}</span>
                                        </label>
                                    </div>
                                    <p
                                        class="error-msg position-absolute"
                                        v-if="showUsersErr"
                                    >
                                        {{ usersErrMsg }}
                                    </p>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button
                                    type="button"
                                    class="
                                        btn btn-outline-secondary
                                        border-radius-50
                                    "
                                    @click.self="isShowInviteDialog = false"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-info border-radius-50"
                                    @click="handleBtnSubInvite"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import { dateFormat } from '@/utils/util';
import { mapState } from 'vuex';
import { getObjectURL, getPictureBase64 } from '@/utils/util';
import {
    getEvents_api,
    postNewEvents_api,
    postEventUsers_api,
    getUsers_api,
    getEventDetail_api,
} from '@/api/index';

export default {
    name: 'Home',
    data() {
        return {
            id: null,
            eventsList: [],
            isShowNewEventDialog: false,
            eventForm: {
                name: '',
                description: '',
                time: new Date(),
                picture: '',
            },
            base64Img: '',
            showNameErr: false,
            nameErrMsg: 'Event name is incorrect',
            showDespErr: false,
            despErrMsg: 'Event description is incorrect',
            showTimeErr: false,
            timeErrMsg: 'Event time is incorrect',
            showUsersErr: false,
            usersErrMsg: 'Event people is incorrect',
            usersList: [],
            users: [],
            isShowInviteDialog: false,
            isShowViewDialog: false,
            eventDetails: {
                name: '',
                description: '',
                tag_time: '',
                image: '',
            },
            eventUsers: [],
        };
    },
    computed: {
        ...mapState(['isLoginSuccess', 'userInfo']),
    },
    components: { DatePicker },
    created() {
        this.getEvents();
        this.getUsers();
    },
    methods: {
        getEvents() {
            getEvents_api()
                .then((res) => {
                    if (res.code == 0) {
                        this.eventsList = res.list;
                    } else if (res.message) {
                        alert(res.message);
                    }
                })
                .catch((err) => {});
        },
        handleBtnCreate() {
            if (!this.isLoginSuccess) {
                this.$router.push('/login');
                return;
            }
            this.isShowNewEventDialog = true;
        },
        handleBtnSub() {
            if (this.eventForm.name === '') {
                this.showNameErr = true;
                return;
            } else {
                this.showNameErr = false;
            }
            if (this.eventForm.description === '') {
                this.showDespErr = true;
                return;
            } else {
                this.showDespErr = false;
            }

            if (!this.eventForm.time) {
                this.showTimeErr = true;
                return;
            } else {
                this.showTimeErr = false;
            }

            this.postNewEvents();
        },
        getUsers() {
            getUsers_api()
                .then((res) => {
                    if (res.code == 0) {
                        this.usersList = res.list;
                    } else if (res.message) {
                        alert(res.message);
                    }
                })
                .catch((err) => {});
        },
        getEventDetail() {
            getEventDetail_api({ id: this.id })
                .then((res) => {
                    if (res.code == 0) {
                        this.eventDetails = Object.assign(
                            this.eventDetails,
                            res.event
                        );
                        this.eventUsers = res.users;
                        this.users = res.users.map((item) => {
                            return item.id;
                        });
                        // console.log(this.users);
                    } else if (res.message) {
                        alert(res.message);
                    }
                })
                .catch((err) => {});
        },
        handleBtnInvite(id) {
            this.id = id;
            this.users = [];
            this.getEventDetail();
            this.isShowInviteDialog = true;
        },
        handleBtnView(id) {
            this.id = id;
            this.getEventDetail();
            this.isShowViewDialog = true;
        },
        closeDetailDialog() {
            this.isShowViewDialog = false;
            this.initEventDetails();
        },
        initEventDetails() {
            this.eventDetails = {
                name: '',
                description: '',
                tag_time: '',
                image: '',
            };
            this.eventUsers = [];
        },
        handleBtnSubInvite() {
            if (!this.users.length) {
                this.showUsersErr = true;
                return;
            } else {
                this.showUsersErr = false;
            }
            this.postEventUsers();
        },
        postEventUsers() {
            let params = {
                id: this.id,
                users_id: this.users,
            };
            postEventUsers_api(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.isShowInviteDialog = false;
                        this.getEvents();
                        this.users = [];
                    } else if (res.message) {
                        alert(res.message);
                    }
                })
                .catch((err) => {});
        },
        handleChangeFile(event) {
            console.log(event.target.files[0]);
            if (event.target.files[0]) {
                let fileObj = event.target.files[0];
                getPictureBase64(fileObj).then((res) => {
                    if (res) {
                        this.base64Img = res;
                    }
                });

                this.eventForm.picture = getObjectURL(fileObj);
            } else {
                this.eventForm.picture = '';
                this.base64Img = '';
            }
        },
        postNewEvents() {
            let time = dateFormat(this.eventForm.time, 'yyyy-mm-dd hh:ii');

            let params = {
                name: this.eventForm.name,
                description: this.eventForm.description,
                tag_time: time,
                image: this.base64Img,
            };
            postNewEvents_api(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.isShowNewEventDialog = false;
                        this.getEvents();
                    } else if (res.message) {
                        alert(res.message);
                    }
                })
                .catch((err) => {});
        },
    },
};
</script>

<style scoped>
.modal {
    display: block;
    background: rgba(0, 0, 0, 0.3);
}

.modal-body {
    max-height: 550px;
    overflow: auto;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.card-img-box {
    overflow: hidden;
    width: 100%;
    height: 120px;
}
.card-img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-img-box img.icon-default-img {
    object-fit: contain;
}

.card-body p {
    height: 24px;
}

.upload-box input[type='file'] {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 240px;
    height: 120px;
    cursor: pointer;
}
.upload-box .input-box {
    padding: 0px;
    width: 240px;
    height: 120px;
    overflow: hidden;
    background-color: transparent;
    color: #fff;
    z-index: 2;
    border: 1px dashed #f2f2f2;
    border-radius: 5px;
    margin-right: 10px;
}

.upload-box .input-box img {
    width: 100px;
    height: 100px;
    margin-top: 10px;
}
.upload-box .upload-txt {
    font-size: 14px;
    color: #999;
}

.upload-box .img-box {
    width: 240px;
    height: 120px;
    overflow: hidden;
    z-index: 1;
    border-radius: 5px;
}

.upload-box .img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
}

.event-user-box {
    width: 65px;
}

.event-user-box p {
    font-size: 14px;
}
</style>