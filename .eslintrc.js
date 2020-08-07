module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // add your custom rules here
  'rules': {
    'no-new': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'eqeqeq': 2,
    'no-var': 2,
    'no-unused-vars': 2,
    'no-empty': 2,
    'no-redeclare': 2,
    'no-useless-escape': 2,
    'no-trailing-spaces': 2,
    'no-multiple-empty-lines': 2,
    'brace-style': 0,
    'no-tabs': 2,
    'semi': ['error','never'],
    'quotes': ['error','single'],

    'space-before-blocks': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],

    'comma-style': ['error','first'],
    'comma-spacing': ['error', { before: false, after: true }],

    'require-jsdoc': 2,
    'valid-jsdoc': ['error', { requireReturn: false, requireParamDescription: false, requireReturnDescription: false }],
  }
}
