const Custom = require('../custom');
const constant = require('../../constant');

module.exports = function (mongoose, Schema) {
  const schema = new Schema({
    _id: {
      type: String,
      comment: 'shortid'
    },
    type: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    matches: {
      type: [String]
    },
    alg_type: {
      type: String, // TODO: params,pathname
    },
    filepath: {
      type: String,
      default: '',
      comment: '处理脚本文件路径'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: Number,
      default: constant.RULE.STATUS.WRITING,
    },
  }, {
    strict: true,
    collections: 'rule',
  });
  schema.loadClass(Custom);
  return mongoose.model('rule', schema);
};