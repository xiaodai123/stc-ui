// 为异步等待添加再生器支持
require('babel-regenerator-runtime');

// 添加所有的spec.js
const testsContext = require.context('./specs', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
const srcContext = require.context('../src', true, /^\.\/(?!main(\.js)?$)/);
srcContext.keys().forEach(srcContext);