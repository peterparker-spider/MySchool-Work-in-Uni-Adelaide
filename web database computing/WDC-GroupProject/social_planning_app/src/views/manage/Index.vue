<template>
    <div>
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link active"
                    id="user-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#users-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                >
                    Users
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link"
                    id="event-plan-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#event-plans-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="pills-profile"
                    aria-selected="false"
                >
                    Event Plans
                </button>
            </li>
        </ul>
        <div class="tab-content" id="myTabContent">
            <div
                class="tab-pane fade show active"
                id="users-tab-pane"
                role="tabpanel"
                aria-labelledby="user-tab"
                tabindex="0"
            >
                <user />
            </div>
            <div
                class="tab-pane fade"
                id="event-plans-tab-pane"
                role="tabpanel"
                aria-labelledby="event-plan-tab"
                tabindex="0"
            >
                <event-plan />
            </div>
        </div>
    </div>
</template>

<script>
import User from '@/views/manage/components/User';
import EventPlan from '@/views/manage/components/EventPlan';

export default {
    components: {
        User,
        EventPlan,
    },
};
</script>

<style scoped>
.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
    background-color: #31d2f2;
}

.nav-link {
    color: #31d2f2;
}
</style>