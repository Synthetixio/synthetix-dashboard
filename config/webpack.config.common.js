const path = require("path");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

const paths = require("./paths");

const isDev = process.env.NODE_ENV === "development";

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
	module: {
		strictExportPresence: true,
		// TODO: Disable require.ensure as it's not a standard language feature.
		// We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
		// { parser: { requireEnsure: false } },
		rules: [
			// Process JS with Babel.
			{
				test: /\.(js|jsx)$/,
				include: paths.appSrc,
				loader: require.resolve("babel-loader"),
				options: {
					compact: process.env.NODE_ENV === "production",
					// This is a feature of `babel-loader` for webpack (not Babel itself).
					// It enables caching results in ./node_modules/.cache/babel-loader/
					// directory for faster rebuilds.
					cacheDirectory: isDev
				}
			},

			// "url" loader works like "file" loader except that it embeds assets
			// smaller than specified limit in bytes as data URLs to avoid requests.
			// A missing `test` is equivalent to a match.
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: require.resolve("url-loader"),
				options: {
					limit: 10000,
					name: "static/media/[name].[hash:8].[ext]"
				}
			},
			// "file" loader makes sure assets end up in the `build` folder.
			// When you `import` an asset, you get its filename.
			{
				test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
				loader: require.resolve("file-loader"),
				options: {
					name: "static/media/[name].[hash:8].[ext]"
				}
			},
			{
				test: /(\.css$)/,
				//loaders: ["style-loader", "css-loader"]
				loaders: ["css-loader"]
			},
			{
				test: [/\.scss$/, /\.sass$/],
				use: ["style-loader", "css-loader", "resolve-url-loader", "sass-loader"]
				//use: ["css-loader", "resolve-url-loader", "sass-loader"]
			}
		]
	},
	// Some libraries import Node modules but don't use them in the browser.
	// Tell Webpack to provide empty mocks for them so importing them works.
	node: {
		dgram: "empty",
		fs: "empty",
		net: "empty",
		tls: "empty",
		child_process: "empty"
	},
	resolve: {
		alias: {
			components: path.resolve(paths.appSrc, "components"),
			routes: path.resolve(paths.appSrc, "routes"),
			stores: path.resolve(paths.appSrc, "stores"),
			resources: path.resolve(paths.appSrc, "resources"),
			actions: path.resolve(paths.appSrc, "actions")
		},
		// This allows you to set a fallback for where Webpack should look for modules.
		// We placed these paths second because we want `node_modules` to "win"
		// if there are any conflicts. This matches Node resolution mechanism.
		// https://github.com/facebookincubator/create-react-app/issues/253
		modules: ["node_modules", paths.appNodeModules, paths.appSrc].concat(
			// It is guaranteed to exist because we tweak it in `env.js`
			process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
		),
		// These are the reasonable defaults supported by the Node ecosystem.
		// We also include JSX as a common component filename extension to support
		// some tools, although we do not recommend using it, see:
		// https://github.com/facebookincubator/create-react-app/issues/290
		extensions: [".js", ".json", ".jsx"],
		plugins: [
			// Prevents users from importing files from outside of src/ (or node_modules/).
			// This often causes confusion because we only process files within src/ with babel.
			// To fix this, we prevent you from importing files out of src/ -- if you'd like to,
			// please link the files into your node_modules/ and let module-resolution kick in.
			// Make sure your source files are compiled, as they will not be processed in any way.
			new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
		]
	}
};
