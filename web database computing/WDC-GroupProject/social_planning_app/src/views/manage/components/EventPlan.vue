<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>TagTime</th>
                    <th>Created</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(event, index) in eventsList"
                    :key="'eventsList' + index"
                >
                    <td>{{ event.id }}</td>
                    <td>{{ event.name }}</td>
                    <td>{{ event.description }}</td>
                    <td>
                        <img :src="event.image" class="event-img shadow-sm" />
                    </td>
                    <td>{{ event.tag_time }}</td>
                    <td>{{ event.created }}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { getEventManage_api } from '@/api/index';

export default {
    data() {
        return {
            eventsList: [],
        };
    },
    created() {
        this.getEventPlans();
    },
    methods: {
        getEventPlans() {
            getEventManage_api()
                .then((res) => {
                    if (res.code == 0) {
                        this.eventsList = res.list;
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
.event-img {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    object-fit: cover;
}
</style>