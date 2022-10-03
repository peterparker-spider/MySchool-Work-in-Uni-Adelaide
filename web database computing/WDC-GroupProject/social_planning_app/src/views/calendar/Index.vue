<template>
    <div class="bg-white calendar-container">
        <div class="calendar-header">
            <div class="calendar-select-group">
                <select
                    class="form-select calendar-select text-info"
                    @change="changeYear($event)"
                    v-model="year"
                >
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                </select>

                <select
                    class="form-select calendar-select text-info"
                    @change="changeMonth($event)"
                    v-model="month"
                >
                    <option value="0">1</option>
                    <option value="1">2</option>
                    <option value="2">3</option>
                    <option value="3">4</option>
                    <option value="4">5</option>
                    <option value="5">6</option>
                    <option value="6">7</option>
                    <option value="7">8</option>
                    <option value="8">9</option>
                    <option value="9">10</option>
                    <option value="10">11</option>
                    <option value="11">12</option>
                </select>
            </div>
        </div>
        <div class="calendar-body">
            <div class="title">
                <ul>
                    <li>Sunday</li>
                    <li>Monday</li>
                    <li>Tuesday</li>
                    <li>Wednesday</li>
                    <li>Thursday</li>
                    <li>Friday</li>
                    <li>Saturday</li>
                </ul>
            </div>
            <div class="content">
                <ul>
                    <li
                        class="text-center"
                        :class="{ 'active opacity-75': item == day }"
                        v-for="(item, index) in daysList"
                        :key="'daysList' + index"
                    >
                        <a
                            class="position-relative"
                            @click="changeDay(item)"
                            href="javascript:"
                        >
                            <span
                                class="
                                    position-absolute
                                    top-0
                                    start-100
                                    translate-middle
                                    p-2
                                    bg-danger
                                    rounded-circle
                                "
                                v-if="item == day && eventsList.length"
                            >
                                <span class="visually-hidden">
                                    {{ eventsList.length }}</span
                                >
                            </span>
                            {{ item }}</a
                        >
                    </li>
                </ul>
            </div>
        </div>
        <div class="events-list-box d-flex pointer my-4">
            <div
                class="w-50"
                v-for="(item, index) in eventsList"
                :key="'eventsList' + index"
                @click="handleBtnView(item.id)"
            >
                <div class="card mb-3">
                    <div class="row g-0 h-100">
                        <div class="col-md-4 h-100">
                            <img
                                :src="item.image"
                                class="img-fluid rounded-start w-100 h-100"
                                v-if="item.image"
                            />
                            <img
                                src="@/assets/images/icon_default_img.png"
                                class="img-fluid rounded-start"
                                v-else
                            />
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">{{ item.name }}</h5>
                                <p class="card-text text-truncate">
                                    {{ item.description }}
                                </p>
                                <p class="card-text text-truncate">
                                    <small class="text-muted">{{
                                        item.tag_time
                                    }}</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
    </div>
</template>

<script>
import { getEvents_api, getEventDetail_api } from '@/api/index';

export default {
    name: 'Calendar',
    data() {
        return {
            date: new Date(),
            daysList: [],
            eventsList: [],
            isShowViewDialog: false,
            eventDetails: {
                name: '',
                description: '',
                tag_time: '',
                image: '',
            },
            eventUsers: [],
            id: null,
        };
    },
    computed: {
        year: {
            get() {
                return this.date.getFullYear();
            },
            set(val) {},
        },
        month: {
            get() {
                return this.date.getMonth();
            },
            set(val) {},
        },
        day() {
            return this.date.getDate();
        },
    },
    created() {
        this.getEventsList();
        this.getDaysList();
    },
    methods: {
        getDaysList() {
            let monthBeginDay = new Date(this.year, this.month, 1);
            let monthEndDay = new Date(this.year, this.month + 1, 0);
            let arrays = new Array(monthBeginDay.getDay());
            for (
                let i = monthBeginDay.getTime();
                i <= monthEndDay.getTime();
                i += 24 * 60 * 60 * 1000
            ) {
                arrays.push(new Date(i).getDate());
            }
            this.daysList = arrays;
        },
        changeDay(day) {
            this.date = new Date(this.year, this.month, day);
            this.eventsList = [];
            this.getEventsList();
        },
        changeMonth(event) {
            this.date = new Date(this.year, event.target.value, this.day);
            this.getDaysList();
            this.eventsList = [];
            this.getEventsList();
        },
        changeYear(event) {
            this.date = new Date(event.target.value, this.month, this.day);
            this.getDaysList();
            this.eventsList = [];
            this.getEventsList();
        },
        getEventsList() {
            let params = {
                plandate: `${this.year}-${this.month + 1}-${this.day}`,
            };
            getEvents_api(params)
                .then((res) => {
                    if (res.code == 0) {
                        this.eventsList = res.list;
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
    },
};
</script>

<style scoped>
.calendar-header {
    position: relative;
    width: 100%;
    height: 60px;
}

.calendar-header .calendar-select-group {
    position: absolute;
    right: 0px;
    width: 240px;
}

.calendar-header .calendar-select-group .calendar-select {
    float: left;
    width: 100px;
    height: 100%;
    margin-left: 20px;
}

.calendar-body {
    width: calc(100% + 12px);
    height: 550px;
}

.calendar-body .title {
    float: left;
    width: 100%;
}

.calendar-body .title > ul {
    list-style-type: none;
}

.calendar-body .title > ul > li {
    background: linear-gradient(to bottom, #27d1f3, #8ae6f9);
    color: #fff;
    float: left;
    width: 14.2%;
    height: 50px;
    line-height: 50px;
    border: 1px solid #f2f2f2;
    margin-left: -1px;
    margin-top: -1px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}

.calendar-body .content > ul {
    list-style-type: none;
}

.calendar-body .content > ul > li {
    float: left;
    width: 14.2%;
    height: 101px;
    line-height: 100px;
    border: 1px solid #f2f2f2;
    margin-left: -1px;
    margin-top: -1px;
}

.calendar-body .content > ul > li > a {
    font-size: 28px;
    color: #999;
    width: 100%;
    display: block;
    line-height: 100px;
    text-decoration: none;
}

.calendar-body .content > ul > li.active > a {
    color: #fff;
    background: #31d2f2;
}

.events-list-box .card {
    height: 120px;
    width: 95%;
}

.events-list-box .card img {
    object-fit: cover;
}

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
