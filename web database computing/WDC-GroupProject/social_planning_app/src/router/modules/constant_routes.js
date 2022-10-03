export default [
	{
		path: '/',
		name: 'Home',
		meta: {
			title: 'Home',
		},
		component: () => import('@/views/home/Index'),
	},
	{
		path: '/login',
		name: 'Login',
		meta: {
			title: 'Login',
		},
		component: () => import('@/views/login/Index'),
	},
	{
		path: '/sign_up',
		name: 'SignUp',
		meta: {
			title: 'SignUp',
		},
		component: () => import('@/views/sign_up/Index'),
	},
	{
		path: '/manage',
		name: 'Manage',
		meta: {
			title: 'Manage'
		},
		component: () => import('@/views/manage/Index'),
	}
];
