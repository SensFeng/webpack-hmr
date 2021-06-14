function updateComplier(complier){
  const config = complier.options;
  // 来自webpack-dev-server/client/index.js，它就是浏览器里面的websocket客户端
  config.entry.main.import.unshift(
    require.resolve('../../client/index.js')
  );
  // webpack/hot/dev-server.js 它用来在浏览器里监听发生的时间，进行后续的热更新逻辑
  config.entry.main.import.unshift(
    require.resolve('../../../webpack/hot/dev-server.js')
  );
  complier.hooks.entryOption.call(config.context, config.entry)
};

module.exports = updateComplier;