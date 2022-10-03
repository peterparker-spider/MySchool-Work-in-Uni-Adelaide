import Vue from 'vue';
import VueRouter from 'vue-router';
import ConstantRoutes from './modules/constant_routes';
import AsyncRoutes from './modules/async_routes';
import { isLoginSuccess, getLoginAuth } from '../api/auth';
import store from '../store';

let routes = ConstantRoutes.concat(AsyncRoutes);

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	routes: routes,
});

router.beforeEach(async (to, from, next) => {
	if (to.meta.title) {
		document.title = 'SOCIAL PLANNING';
	}

	if (to.meta.requireAuth) {
		if (!isLoginSuccess()) {
			store.commit('setLoginStatus', false);
			getLoginAuth().then((token) => {
				if (token) {
					if (to.path === '/login') {
						next({ path: '/' });
					} else {
						next({ ...to, replace: true });
					}
				} else {
					next(`/login?redirect=${to.path}`);
				}
			});
		} else {
			store.commit('setLoginStatus', true);
			next();
		}
	} else {
		next();
	}
});

export default router;
