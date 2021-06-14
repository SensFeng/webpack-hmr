/**
 * WDM负责提供文件预览
 * 拦截http请求，看看请求的文件是不是wbepack打包出来的文件
 * 如果是的话，从硬盘上读出来，返回给客户端
 * @param {*} context 
 * @returns 
 */
const path = require('path');
const mime = require('mime');

function wrapper(context) {
  const {fs, outputPath} = context;
  return function middleware(req, res, next) {
    let url = req.url;
    if(url === '/') url = '/index.html';
    let filename = path.join(outputPath, url);
    try {
      let stat = fs.statSync(filename);
      if(stat.isFile()) {
        let content = fs.readFileSync(filename);
        res.setHeader('Content-Type', mime.getType(filename));
        res.send(content);
      } else {
        return res.sendStatus(404);
      }
    } catch (err) {
      return res.sendStatus(404);
    }
  }
}

module.exports = wrapper;