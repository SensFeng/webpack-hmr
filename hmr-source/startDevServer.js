const webpack = require('webpack');
const config = require('./webpack.config');
const Server = require('./webpack-dev-server/lib/Server');
// const Server = require('./node_modules/webpack-dev-server/lib/Server');

function startDevServer(complier, config) {
  const devServerArgs = config.devServer || {};
  // 启动http服务器，里面还会负责打包我们的项目并提供预览服务，通过它访问打包后的文件
  const server = new Server(complier, devServerArgs);
  const {port = 8080, host = 'localhost'} = devServerArgs;
  server.listen(port, host, (err) => {
    console.log(`自定义 => Project is running at http://${host}: ${port}`)
  })
};

// 2.创建complier实例
const complier = webpack(config);
// console.log('complier', complier.options);
// 3.启动服务HTTP服务器
startDevServer(complier, config);

module.exports = startDevServer;

