module.exports = {
	extends: ['last', 'plugin:import/errors'],

	env: {
		es6: true,
		jest: true,
		node: true,
	},

	rules: {
		'import/no-unresolved': 'error',
		'no-console': 'off',
		'prettier/prettier': 'off',
		'prefer-arrow-callback': 'error',
		'space-before-blocks': ['error', 'always'],
		'prefer-const': 'error',
		'no-shadow': 'error',
	},
};
