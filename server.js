const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();
const PROT = 4800;
app.use(express.static('dist'));


// 路径 /api
// const apiProxy = proxy('/api/**', {
//   target: "http://localhost:3000",
//   secure: false,
//   changeOrigin: true,
//   pathRewrite: {
//     "^/api": ""
//   }
// })

// 路径 /
const apiProxy = proxy('/api/**', {
  target: "http://localhost:3000",
  changeOrigin: true,
})

app.use(apiProxy);

app.listen(PROT, function (err) {
  if (err) {
    console.log('err:', err)
  } else {
    console.log('listen at http://localhost:', PROT)
  }
})