
/**
 * webpack-dev-middleware 
 * 1. 真正以监听的模式启动webpack的编译
 * 2. 返回一个express中间件，用来预览我们产出的资源文件
 * @param {} complier 
 * @returns 
 */

const middleware = require('./lib/middleware');
const MemoryFileSystem = require('memory-fs');
const memoryFileSystem = new MemoryFileSystem();

function webpackDevMiddleware(complier) {
  // 开始编译并且监听文件变化
  complier.watch({}, () => {
    console.log('监听到了文件的变化，webpack重新开始编译')
  })
  let fs = complier.outputFileSystem = memoryFileSystem;
  return middleware({
    fs,
    outputPath: complier.options.output.path // 输出目录
  })
};
module.exports = webpackDevMiddleware;