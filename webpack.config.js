import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import CopyPlugin from "copy-webpack-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
	mode: "development",
	entry: "./js/main.js",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
		clean: true, 
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html",
		}),
		new MiniCssExtractPlugin({
			filename: "style.css",
		}),
		new CopyPlugin({
			patterns: [
				{ from: "public", to: "./public" }, 
			],
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: "asset/resource",
				generator: {
					filename: "images/[name][ext]",
				},
			},
		],
	},
}
