module.exports = {
	extends: ['last', 'plugin:import/errors'],

	env: {
		es6: true,
		jest: true,
		browser: true,
		node: true,
	},

	plugins: ['react'],

	rules: {
		'import/no-unresolved': 'error',
		'no-console': 'off',
		'prettier/prettier': 'off',
		'prefer-arrow-callback': 'error',
		'space-before-blocks': ['error', 'always'],
		'prefer-const': 'error',
		'no-shadow': 'error',
		'indent': ['error', 'tab'],
		'react/jsx-no-undef': 2,
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
	},
};
