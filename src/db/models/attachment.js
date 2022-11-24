const constant = require('../../constant')
const Custom = require('../custom');

module.exports = function (mongoose, Schema) {
  const schema = new Schema({
    _id: {
      type: String,
      comment: 'guid'
    },
    resource_id: {
      type: String,
      default: '',
    },
    // 可能分表
    resource_type: {
      type: String,
    },
    media_type: {
      type: String, // image,video,audio,file
    },
    target_type: {
      type: String, // 图片或视频转码,doc转PDF?
    },
    position: {
      // 多余的应该根据resource_type自动判断 gallery,comics,movie,mv,anime(动画),video(长视频),music,audio,short,files,doc,
      type: String, // thumbnail,poster,content,
    },
    more: {
      width: Number,
      height: Number,
      portrait: Boolean,
      size: Number,
      duration: Number,
    },
    title: {
      type: String,
    },
    url: {
      type: String,
      default: '',
    },
    filepath: {
      type: String,
      default: '',
    },
    temppath: {
      type: String, // 如果是需要转码
    },
    seq: {
      type: Number,
      default: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: Number,
      default: constant.ATTACHMENT.STATUS.CREATED,
    },
    message: String, // 错误信息
  }, {
    strict: true,
    collections: 'attachment',
  });
  schema.loadClass(Custom);
  return mongoose.model('attachment', schema);
};