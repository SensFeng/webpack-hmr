const express = require('express');
const http = require('http');
const io = require('socket.io');
const updateComplier = require('./utils/updateCompiler.js');
const webpackDevMiddleware = require('../../webpack-dev-middleware');
class Server {
  constructor(complier, devServerArgs) {
    this.sockets = []; //
    this.complier = complier;
    this.devServerArgs = devServerArgs;
    updateComplier(complier); // 注册了hot-server-entry和client-entry入口
    this.setupHooks(); // 添加webpack编译勾子
    this.setupApp();
    this.routes();
    this.setupDevMiddleware(); // 使用webpack-dev-middleware中间件
    this.createServer();
    this.createSocketServer();
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
      console.log('新的编译的hash', stats.hash);
      // 以后每一次新的编译成功后，都要向客户端发送最新的hash值和ok
      this.sockets.forEach(socket => {
        socket.emit('hash', stats.hash);
        socket.emit('ok')
      })
      this._stats = stats; // 保存stats信息
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
  createSocketServer(){
    // websocket通信之前要握手，依赖与http服务器
    const websocketServer = io(this.server);
    websocketServer.on('connection', (socket) => {
      console.log('一个新的websocket客户端已经连接起来了');
      this.sockets.push(socket); // 收集客户端，为了编译成功之后广播做准备
      // 断开连接删除socket
      socket.on('disconnect', () => {
        let index = this.sockets.indexOf(socket);
        this.sockets.splice(index, 1);
      });
      // 如果以前已经编译过了，就把上一次的hash的值和ok发送给客户端
      if (this._stats) {
        socket.emit('hash', this._stats.hash);
        socket.emit('ok')
      }
    })
  }

  listen(port, host, callback) {
    this.server.listen(port, host, callback);
  }
}

module.exports = Server;