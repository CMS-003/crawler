const ioHelper = require('./helper');
const fs = require('fs');
const path = require('path')

module.exports = class localStorage {
  static _storeOne(file, format, dirpath) {
    let filepath = '', relpath = '';
    let isExisted = true;
    while (isExisted) {
      relpath = ioHelper.generatePath(format, file.originalname);
      if (!relpath.startsWith('/')) {
        relpath = '/' + relpath
      }
      filepath = dirpath + relpath;
      const dir = path.dirname(filepath)
      if (!ioHelper.isDirExists(dir)) {
        ioHelper.mkdirs(dir)
      }
      if (!ioHelper.isFileExists(filepath)) {
        isExisted = false;
        ioHelper.moveFile(file.path, filepath);
      }
    }
    return relpath;
  }
  static async create(files, format, dir = CFG.UPLOAD_PATH) {
    const res = {};
    for (let i = 0; i < files.length; i++) {
      const field = files[i].fieldname;
      if (format[field] === undefined) {
        continue;
      }
      let relpath = localStorage._storeOne(files[i], format[field], dir);
      res[field] = relpath;
    }
    return res;
  }
  static async destroy(filepath) {
    fs.unlink(CFG.UPLOAD_PATH + filepath);
  }
};