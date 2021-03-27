module.exports = {
    env: {
        es6: true,
    },
    plugins: [
        '@typescript-eslint', // 启用TypeScript插件
    ],
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended', // 启用TypeScript的规则
    ],
    parserOptions: {
        ecmaVersion: 2018, // ES的版本
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts'], // 限制node端的import
            },
        },
    },
    rules: {
        indent: ['error', 4, {
            SwitchCase: 1,
        }],
        'no-console': ['error', {
            allow: ['log', 'error'],
        }],
        'no-underscore-dangle': ['error', {
            allow: ['_decorator'],
            allowAfterThis: true,
        }],
        'no-unused-expressions': ['error', {
            allowShortCircuit: true,
        }],
        'spaced-comment': ['error', 'always', {
            exceptions: ['*'],
        }],
        'no-await-in-loop': 'off',
        'no-use-before-define': ['error', 'nofunc'],
        // airbnb-base没有添加ts，手动修改一下
        'import/extensions': ['error', 'ignorePackages', {
            js: 'never',
            ts: 'never',
        }],
    },
};
