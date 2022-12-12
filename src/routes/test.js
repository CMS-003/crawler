const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  return {
    /**
     * @api {get} /test/string 1.测试返回字符串
     * @apiGroup test-string
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * Hello World
     */
    'get /test/string': (req, res) => {
      res.send('Hello World');
    },
    /**
     * @api {get} /test/json 2.测试返回对象
     * @apiGroup test-json
     * 
     * @apiSuccessExample Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   key: 'value'
     * }
     */
    'get /test/json': (req, res) => {
      res.json({ key: 'value' });
    },
    /**
     * @api {get} /test/image 3.测试返回图片
     * @apiGroup test-image
     */
    'get /test/image': (req, res) => {
      // 方法一:
      // res.set({ 'Content-Tye': 'image/jpeg' });
      // res.sendFile(CFG.STATIC_PATH + '/logo.jpg');
      // 方法二:
      fs.createReadStream(CFG.STATIC_PATH + '/logo.jpg').pipe(res);
    },
    /**
     * @api {get} /test/download 4.测试下载文件
     * @apiGroup test-download
     */
    'get /test/download': (req, res) => {
      res.download(CFG.STATIC_PATH + '/logo.jpg');
    },
    /**
     * @api {get} /test/req-paging 5.测试处理分页querystring
     * @apiGroup test-req-paging
     */
    'get /test/req-paging': (req, res) => {
      return req.paging();
    },
    /**
     * @api {get} /test/res-paginator 6.测试res添加paging()方法
     * @apiGroup test-res-paginator
     */
    'get /test/res-paginator': (req, res) => {
      return res.paginator([]);
    },
    /**
     * @api {get} /test/res-success 8.测试res添加success()方法
     * @apiGroup test-res-success
     */
    'get /test/res-success': (req, res) => {
      res.success();
    },
    /**
     * @api {get} /test/res-fail 9.测试res添加fail()方法
     * @apiGroup test-res-fail
     */
    'get /test/res-fail': (req, res) => {
      res.fail();
    },
    /**
     * @api {get} /test/res-error 10.测试res添加error()方法
     */
    'get /test/res-error': (req, res) => {
      const err = new Error('test');
      err.unit = 'auth';
      err.type = 'NoPermission';
      throw err;
    },
    /**
     * @api {put} /test/api-put 11.测试put请求和组合API,原样返回数据
     * @apiGroup test-put
     */
    'put /test/put': (req, res) => {
      return req.body;
    },
    'get /test/get': (req, res) => {
      return req.query;
    },
    /**
     * @api {post} /test/local-upload-object 上传服务器返回对象
     * @apiGroup test-upload
     */
    'post /test/upload': async (req, res) => {
      let urls = await req.upload({ 'test': 'test/{YY}-{MM}-{DD}/{HH}{II}{SS}-{6}.{ext}' });
      return urls;
    },
    /**
     * @api get /test/ip-info 代理与ip信息
     * @apiGroup ip
     */
    'get /test/ip-info': (req, res) => {
      return {
        headers: req.headers,
        'x-forwarded-for': req.header('x-forwarded-for') || '',
        remoteAddress: req.connection.remoteAddress,
        ips: JSON.stringify(req.ips),
        ip: req.ip
      };
    },
    /**
     * @api get /test/excel
     * @apiGroup xlsx
     */
    'get /test/excel': (req, res) => {
      return app.excel.parse(path.normalize(app.config.ROOT_PATH + '/test/test.xlsx'));
    },
    /**
     * @api post /test/excel
     * @apiGroup xlsx
     */
    'post /test/excel': (req, res) => {
      const filepath = `${app.config.UPLOAD_PATH}/test.xlsx`;
      app.excel.create(filepath, req.body);
      return filepath;
    },
    /**
     * @api post /test/base64-encode
     * @apiGroup base64
     */
    'post /test/base64-encode': (req, res) => {
      const { Base64Encode, StringStream } = app.stream;
      const ss = new StringStream();
      ss.pipe(new Base64Encode()).pipe(res);
      ss.append(req.body.string).append(null);
    },
    /**
     * @api post /test/base64-decode
     * @apiGroup base64
     */
    'post /test/base64-decode': (req, res) => {
      const { Base64Decode, StringStream } = app.stream;
      const ss = new StringStream();
      ss.pipe(new Base64Decode()).pipe(res);
      ss.append(req.body.string).append(null);
    }
  }
}