module.exports = {
	projects: [
		{
			preset: 'ts-jest',
			roots: ['./lib'],
			displayName: 'dom',
			testEnvironment: 'jsdom',
			testMatch: ['**/*.test?(.browser).ts'],
		},
		{
			preset: 'ts-jest',
			roots: ['./lib'],
			displayName: 'node',
			testEnvironment: 'node',
			testMatch: ['**/*.test?(.node).ts'],
		},
		{
			roots: ['./bundle'],
			displayName: 'bundle',
			testEnvironment: 'jsdom',
			testMatch: ['**/*.test.js'],
		},
	],
};
