const constant = require('../../constant')
const Custom = require('../custom');

module.exports = function (mongoose, Schema) {
  const schema = new Schema({
    _id: {
      type: String,
      comment: 'guid'
    },
    rule_id: {
      type: String,
      default: '',
    },
    resource_id: String,
    url: String,
    params: Object, // 配合rule的match生成url。source_id可能是url中的id，也可能是params参数联合创建的
    raw: Object,
    source_id: {
      type: String,
      default: '',
    },
    source_type: {
      type: String,
      default: '',
    },
    title: {
      type: String,
    },
    cover: {
      type: String,
    },
    content: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    tags: [String],
    creator: { name: String, icon: String }, // id name icon
    people: [{
      _id: false,
      role: String,
      user: [{ _id: false, name: String, icon: String, id: String }]
    }],
    region_code: {
      type: String,
      default: 'zh-CN',
    },
    lang: {
      type: String,
      default: 'CN',
    },
    series_id: {
      type: String,
      default: '',
    },
    attachments: [String],
    createdAt: {
      type: Date,
      default: Date.now
    },
    chapters: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    crawledAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: Number,
      default: constant.RECORD.STATUS.CREATED,
    },
    update_status: {
      type: Number,
      default: 1, // 1 连载中 2 已完结
    },
    update_text: {
      type: String,
      default: '', // 更新信息
    },
    available: {
      type: Number, // 0 下线 1 上线
      default: 0,
    },
    retry: {
      type: Number,
      default: 0,
    }
  }, {
    strict: true,
    collections: 'record',
  });
  schema.loadClass(Custom);
  return mongoose.model('record', schema);
};