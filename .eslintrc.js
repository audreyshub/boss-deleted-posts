const path = require('path')

module.exports = {
  parser: 'babel-eslint',
  globals: {
    __PATH_PREFIX__: true,
  },
  rules: {
    'graphql/template-strings': [
      'error',
      {
        env: `relay`,
        schemaString: fs.readFileSync(path.resolve(__dirname, './schema.graphql'), {
          encoding: 'utf-8',
          flag: 'r',
        }),
        tagName: `graphql`,
      },
    ],
    'react/jsx-uses-react': 2,
    'react/react-in-jsx-scope': 2,
    'react/no-array-index-key': 0,
    'react/prop-types': 0,
    'react/destructuring-assignment': 0,
    'no-else-return': 0,
  },
  extends: [
    'react-app',
    'plugin:jsx-a11y/recommended',
    'airbnb',
    'airbnb/hooks',
    'prettier',
    'prettier/react',
  ],
  plugins: ['jsx-a11y', 'graphql', 'react'],
}
