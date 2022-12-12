const crypto = require('crypto');
const sparkmd5 = require('spark-md5')
const { match } = require("path-to-regexp");

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
  /**
   * 生成resource_id
   * @param {string} rule_id 
   * @param {string} source_id 
   * @returns 
   */
  genResourceId: (rule_id, source_id) => {
    return sparkmd5.hash(`${rule_id}-${source_id}`);
  },
  getUrlParamsByRule: (rule, url) => {
    const { pathname } = new URL(url);
    let param = null;
    for (let i = 0; i < rule.patterns.length; i++) {
      const match_url = rule.patterns[i];
      const fn = match(new URL(match_url).pathname || '', { decode: decodeURIComponent });
      const params = fn(pathname);
      if (params.params) {
        param = params.params;
        break;
      }
    }
    return param;
  },
}