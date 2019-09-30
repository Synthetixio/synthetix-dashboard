const path = require("path");

const paths = require("./paths");

module.exports = {
	resolve: {
		alias: {
			components: path.resolve(paths.appSrc, "components"),
			routes: path.resolve(paths.appSrc, "routes"),
			stores: path.resolve(paths.appSrc, "stores"),
			resources: path.resolve(paths.appSrc, "resources"),
			api: path.resolve(paths.appSrc, "api"),
			actions: path.resolve(paths.appSrc, "actions")
		}
	}
};
