const constant = require('../../constant')
const Custom = require('../custom');

// content内或封面用attachment.video、chapter、image分表
module.exports = function (mongoose, Schema) {
  const schema = new Schema({
    _id: {
      type: String,
      comment: 'guid'
    },
    v_id: {
      type: String,
      default: '',
    },
    resource_id: {
      type: String,
      default: '',
    },
    type: {
      type: Number,
      default: constant.VIDEO.TYPE.FEATURE,
    },
    more: {
      width: Number,
      height: Number,
      rotate: Number,
      size: Number,
      duration: Number,
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    cover: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    filepath: {
      type: String,
      default: '',
    },
    realpath: {
      type: String, // 如果是需要转码.m3u8
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    nth: {
      type: Number,
      default: 1
    },
    status: {
      type: Number,
      default: constant.ATTACHMENT.STATUS.CREATED,
    },
    message: String, // 错误信息
  }, {
    strict: true,
    collections: 'video',
  });
  schema.loadClass(Custom);
  return mongoose.model('video', schema);
};