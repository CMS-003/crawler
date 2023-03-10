const express = require('express');
const app = express();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const multer = require('multer');

// 全局异常
process.on('uncaughtException', (err) => {
  console.error(err, 'uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  console.error(reason, 'unhandledRejection');
});

// 全局开始
Object.defineProperty(global, 'CFG', {
  value: {},
  writable: false,
  enumerable: true,
  configurable: false
});
app.extend = function (obj, bind = false) {
  for (let fn in obj) {
    app[fn] = obj[fn];
    if (typeof obj[fn] === 'function' && bind) {
      app[fn].bind(this);
    }
  }
};
app.extend({
  stream: require('./utils/steam'),
  excel: require('./utils/excel'),
  loader: require('./utils/loader'),
  models: require('./db/index'),
  constant: require('./constant'),
})
app.define = function (key, value) {
  global.CFG[key] = value;
};
app.defineMulti = function (o) {
  for (let k in o) {
    this.define(k, o[k]);
  }
};

// 框架加载
app.extend(require('./extend/application'), true);
app.loadRoutes(__dirname + '/routes');

app.run = async function (cb, callback) {
  // 实例中的
  app.defineMulti(require('./config.js'));

  // .安全部分
  this.use(helmet());

  // .跨域处理
  this.use(require('./middleware/cors').bind(this));

  // .静态目录
  if (this.config.STATIC_PATH instanceof Array) {
    this.config.STATIC_PATH.forEach(static_path => {
      this.use(express.static(static_path));
    })
  } else {
    this.use(express.static(this.config.STATIC_PATH));
  }


  // .请求限制的处理
  this.use(express.json({ limit: this.config.UPLOAD.fileSize }));
  this.use(compression());

  // .解析请求
  this.use(bodyParser.json({ limit: this.config.UPLOAD.fileSize }));
  this.use(bodyParser.urlencoded({ limit: this.config.UPLOAD.fileSize, extended: true }));

  // 自动清理文件...日
  //this.use(multerAutoReap);

  // .扩展req和res
  this.use(require('./middleware/extend').bind(this));

  // .form文件解析
  const fileParser = multer({
    storage: multer.diskStorage({
      destination: this.config.ROOT_PATH + '/.tmp'
      // filename
    }),
    // fieldNameSize/fieldSize/fields/fileSize/files/parts/headerPairs/
    limits: this.config.UPLOAD
    // fileFilter
  }).any();//.fields() 指定上传字段
  this.use(fileParser);

  // 插入点
  if (cb) {
    await cb.call(this);
  } else {
    this.dispatch();
    // .默认错误
    this.use(function (err, req, res, next) {
      console.log(err);
      if (err) {
        res.error(err);
      } else {
        next();
      }
    });
    // .404处理
    this.use(function (req, res, next) {
      if (!res.headersSent) {
        res.error(new Error('404'));
      } else {
        next();
      }
    });

  }

  // 定时任务
  // this.schedule.load(require('./schedules/test.js'), this);
  // const sres = this.schedule.tick('test');
  // console.log(sres);
  // this.schedule.start('test');

  const server = this.listen(CFG.PORT, '0.0.0.0', () => {
    console.log(`项目 ${CFG.PROJECT_NAME} 已启动:端口(${CFG.PORT})`);
  });
  callback && callback(server);

};

app.run();

module.exports = app;
