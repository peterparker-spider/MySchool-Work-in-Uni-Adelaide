export default [
	{
		path: '/calendar',
		name: 'Calendar',
		meta: {
			title: 'Calendar',
			requireAuth: true,
		},
		component: () => import('@/views/calendar/Index'),
	},
	{
		path: '/user_center',
		name: 'UserCenter',
		meta: {
			title: 'UserCenter',
			requireAuth: true,
		},
		component: () => import('@/views/user_center/Index'),
	},
];
