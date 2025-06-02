const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8089', // 또는 백엔드 포트
      changeOrigin: true,
    })
  );
};
