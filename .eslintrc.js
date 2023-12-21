/** @type {import('eslint').Linter.Config} */
module.exports = {
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:node/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        'import/order': [
            1,
            {
                groups: [
                    'external',
                    'builtin',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                ],
                pathGroups: [
                    {
                        pattern: '@src/**',
                        group: 'internal',
                    },
                ],
                pathGroupsExcludedImportTypes: ['internal'],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
                'newlines-between': 'always',
            },
        ],
        '@typescript-eslint/consistent-type-imports': 'off',
        'import/no-duplicates': [
            'error',
            { 'prefer-inline': true, considerQueryString: true },
        ],
        'no-console': 'error',
    },
}
