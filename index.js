var hexo = hexo || {};
var path = require('path');
var serveStatic = require('serve-static');

hexo.extend.filter.register('server_middleware', function serve(app) {
  app.use(hexo.config.root + 'editor/', serveStatic(path.join(__dirname, 'dist')));
});

