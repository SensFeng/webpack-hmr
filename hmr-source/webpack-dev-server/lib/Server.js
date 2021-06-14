const express = require('express');
const http = require('http');
const updateComplier = require('./utils/updateCompiler.js');
const webpackDevMiddleware = require('../../webpack-dev-middleware');
class Server {
  constructor(complier, devServerArgs) {
    this.complier = complier;
    this.devServerArgs = devServerArgs;
    updateComplier(complier); // 注册了hot-server-entry和client-entry入口
    this.setupHooks(); // 添加webpack编译勾子
    this.setupApp();
    this.routes();
    this.setupDevMiddleware(); // 使用webpack-dev-middleware中间件
    this.createServer();
  }
  routes() {
    if (this.devServerArgs.contentBase) {
      this.app.use(express.static(this.devServerArgs.contentBase));
    }
  }
  setupHooks() {
    const {
      done,
    } = this.complier.hooks;
    done.tap('webpack-dev-server', (stats) => {
      console.log('stats.hash', stats.hash);
      this._stats = stats;
    })
  }
  setupDevMiddleware() {
    this.middleware = webpackDevMiddleware(this.complier);
    this.app.use(this.middleware);
  }
  setupApp() {
    this.app = express(); //执行express函数得到this.app  代表http应用对象
  }
  createServer() {
    //通过http模 块创建一个普通的http服务器
    //this.app是一个路由中间件
    this.server = http.createServer(this.app);
  }
  listen(port, host, callback) {
    this.server.listen(port, host, callback);
  }
}

module.exports = Server;