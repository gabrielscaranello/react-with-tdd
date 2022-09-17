import * as path from 'path'
import * as webpack from 'webpack'
import 'webpack-dev-server'

import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const config: webpack.Configuration = {
	mode: 'development',
	entry: './src/main/index.tsx',
	output: {
		path: path.join(__dirname, 'public/js'),
		publicPath: '/public/js',
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.sass'],
		alias: {
			'@': path.join(__dirname, 'src')
		}
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.sass$/,
				use: [
					{ loader: 'style-loader' },
					{ loader: 'css-loader', options: { modules: true } },
					{ loader: 'sass-loader' }
				],
				exclude: /node_modules/
			}
		]
	},
	devServer: {
		devMiddleware: {
			writeToDisk: true
		},
		static: {
			directory: './public'
		},
		historyApiFallback: true,
		port: 8080
	},
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM'
	},
	plugins: [new CleanWebpackPlugin()]
}

export default config
