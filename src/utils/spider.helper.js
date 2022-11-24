const crypto = require('crypto');
const sparkmd5 = require('spark-md5')

module.exports = {
  params2id: (params) => {
    if (params.id) {
      return params.id;
    }
    const str = Object.keys(params).sort().map(key => {
      return `${key}=${params[key]}`;
    }).join('&');
    return crypto.createHash('md5').update(str).digest('hex');
  },
  source2resource_id: (source_type, source_id) => {
    return sparkmd5.hash(`${source_type}-${source_id}`);
  }
}