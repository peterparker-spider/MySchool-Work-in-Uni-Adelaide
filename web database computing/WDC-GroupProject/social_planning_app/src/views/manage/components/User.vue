<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Image</th>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Age</th>
                    <th>Email</th>
                    <th>IsManager</th>
                    <th>Created</th>
                    <!-- <th>Action</th> -->
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(user, index) in usersList"
                    :key="'usersList' + index"
                >
                    <td>{{ user.id }}</td>
                    <td>{{ user.username }}</td>
                    <td>
                        <img :src="user.image" class="avatar shadow-sm" />
                    </td>
                    <td>{{ user.firstname }}</td>
                    <td>{{ user.lastname }}</td>
                    <td>{{ user.age }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.is_manager === 1 ? '✓' : '' }}</td>
                    <td>{{ user.created }}</td>
                    <!-- <td></td> -->
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { getUserManage_api } from '@/api/index';

export default {
    data() {
        return {
            usersList: [],
        };
    },
    created() {
        this.getUsers();
    },
    methods: {
        getUsers() {
            getUserManage_api()
                .then((res) => {
                    if (res.code == 0) {
                        this.usersList = res.list;
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
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}
</style>