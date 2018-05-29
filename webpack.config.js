const { resolve } = require('path')
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const pxtorem = require('postcss-pxtorem');
const sourcePath = path.join(__dirname, './src');
const staticsPath = path.join(__dirname, './dist');
const svgDirs = [
	require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
	// path.resolve(__dirname, 'src/static'),  // 2. 自己私人的 svg 存放目录
];
module.exports = function (env) {
	console.log('nodeEnv',env,env.prod)
	const nodeEnv = env && env.prod ? 'production' : 'development';
	const isProd = nodeEnv === 'production';
	const _isUle = env.ule === 'true';
	const _test = env.test === 'true';
	console.log(!_isUle ? 'beta环境' : '生产环境')
	const plugins = [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: 4,
			filename: 'js/vendor.[hash:5].js'
		}),
		new ExtractTextPlugin({filename : 'css/[name]/styles.css', allChunks: true}),
		new webpack.DefinePlugin({
			"process.env": {
				"NODE_ENV": JSON.stringify(nodeEnv)
			},
			__DEV__ : !_isUle,
			__PRD__:_isUle,
			__TEST__ : _test
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.LoaderOptionsPlugin({
			options : {
				sassLoader : {
					includePaths: [path.resolve(__dirname, 'src', 'scss')]
				},
				context: '/',
				postcss: [
					require('postcss-font-magician')(),
					require('autoprefixer')({browsers: ['iOS >= 8', 'Android >= 4.1']}),
					require('precss')
				]
			}
		}),
		new HtmlWebpackPlugin({
			/*
			 template参数指定入口html文件路径, 插件会把这个文件交给webpack去编译,
			 webpack按照正常流程, 找到loaders中test条件匹配的loader来编译, 那么这里html-loader就是匹配的loader
			 html-loader编译后产生的字符串, 会由html-webpack-plugin储存为html文件到输出目录, 默认文件名为index.html
			 可以通过filename参数指定输出的文件名
			 html-webpack-plugin也可以不指定template参数, 它会使用默认的html模板.
			 */
			filename : './index.html',
			template : './index.html',
			inject : 'body'
		}),
		new webpack.ProvidePlugin({
			React:"react",
			_ : 'lodash',
			PropTypes : 'prop-types',
			moment : 'moment'
		})
	];
	if (isProd) {
		plugins.push(
			new webpack.LoaderOptionsPlugin({
				minimize: true,
				debug: false
			}),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
					screw_ie8: true,
					conditionals: true,
					unused: true,
					comparisons: true,
					sequences: true,
					dead_code: true,
					evaluate: true,
					if_return: true,
					join_vars: true,
				},
				output: {
					comments: false,
				},
			})
		);
	} else {
		plugins.push(
			new webpack.HotModuleReplacementPlugin()
		);
	}

	return {
		devtool: isProd ? 'source-map' : 'eval',
		entry: {
			bounde: './src/main.js',
			vendor: ['react','react-dom','redux','react-redux','react-router-dom','react-tap-event-plugin']
		},
		output: {
			path: staticsPath,
			filename: 'js/[name].[chunkhash:5].js',
			publicPath: isProd ? `//i1.${_isUle ? 'ulecdn' : 'beta.ule'}.com/app/yzg/pad/web/` : '/',
			// 添加 chunkFilename
			chunkFilename: 'js/[name].[chunkhash:5].chunk.js',
		},
		module : {
			rules : [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: ['babel-loader']
				},
				{
					test: /\.scss$/,
					exclude: /node_modules/,
					loader: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use : [{
							loader : 'css-loader',options: {minimize: true}
						},'postcss-loader','sass-loader?sourceMap']
					}),
				},
				{
					test : /\.css$/,
					use : ExtractTextPlugin.extract({
						fallback: "style-loader",
						use :[
							{loader: 'css-loader',options: {importLoaders : 1,minimize: true}},
							{loader: 'postcss-loader',options:{
								plugins:[]
							}}
						]
					}),
					include:/node_modules/
				},
				
				{
					test: /\.(jpe?g|png|gif)$/i,
					use: ["file-loader?name=i/[name].[ext]"]
				},
				{
					test: /\.(svg)$/i,
					loader: ['svg-sprite-loader'],
					include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
				}
			]
		},
		resolve: {
			extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json'],
			modules: [ "node_modules" , path.resolve(__dirname, "src")],
			alias: {
				'@': resolve('src'),
				'temp': resolve('src/components'),
				'temps': resolve('src/components/tempalte'),
				'types': resolve('src/types'),
				'action': resolve('src/action'),
				'drawerTypes' : resolve('src/components/Drawers/types.js'),
				'core' : resolve('src/core'),
			}
		},
		plugins,

		performance: isProd && {
			maxAssetSize: 100,
			maxEntrypointSize: 300,
			hints: 'warning',
		},
		stats: {
			colors: {
				green: '\u001b[32m',
			}
		},

		devServer: {
			historyApiFallback: true,
			disableHostCheck: true,
			host:'0.0.0.0',
			port: 4545,
			compress: isProd,
			inline: !isProd,
			hot: !isProd,
			stats: {
				assets: true,
				children: false,
				chunks: false,
				hash: false,
				modules: false,
				publicPath: false,
				timings: true,
				version: false,
				warnings: true,
				colors: {
					green: '\u001b[32m',
				}
			},
		}
	}

}
