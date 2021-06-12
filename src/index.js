require('./index.css');

const render = () => {
  let title = require('./title.js');
  document.getElementById('root').innerText = title;
};
render();
if(module.hot) {
  module.hot.accept(['./title.js'], render);
}