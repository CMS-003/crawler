const mongoose = require('mongoose');
const config = require('../config');
const fs = require('fs');
const path = require('path');

/**
 * 遍历文件夹
 * @param {object} opt 参数
 * @param {function} cb 回调函数
 */
function loader(opt, cb = null) {
  scanner(opt.dir, cb, opt.filter, opt.recusive);
}

function scanner(dir, cb, filter, recusive) {
  fs.readdirSync(dir).forEach(file => {
    const fullpath = path.join(dir, file);
    const ext = path.extname(file).toLocaleLowerCase();
    const filename = file.substr(0, file.length - ext.length);
    if (recusive === true && fs.existsSync(fullpath) && fs.lstatSync(fullpath).isDirectory()) {
      scanner(fullpath, cb, filter, recusive);
    } else if (cb) {
      // filter处理
      cb({ fullpath, dir, filename, ext });
    }
  });
}

mongoose.connect(`mongodb://${config.mongo.user ? config.mongo.user + ':' + config.mongo.pass + '@' : ''}${config.mongo.host}:${config.mongo.port}/${config.mongo.db}?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const models = {};
loader({ dir: __dirname + '/models' }, function (info) {
  const name = info.filename[0].toUpperCase() + info.filename.substr(1);
  const schema = require(info.fullpath)
  models[name] = schema(mongoose, mongoose.Schema)
});

module.exports = models;