const path = require('path');
const publicPath = '/';

module.exports = {
	publicPath,
	outputDir: 'dist',
	assetsDir: 'static',
	devServer: {
		host: '127.0.0.1',
		port: 8080,
	},
	filenameHashing: false,
	productionSourceMap: false,
	css: {
		requireModuleExtension: true,
		extract: {
			filename: `static/css/[name].css`,
			chunkFilename: `static/css/[name].css`,
		},
	},
	chainWebpack: (config) => {
		config.resolve.alias.set('@', path.resolve(__dirname, './src'));
	},
	lintOnSave: false,
};
