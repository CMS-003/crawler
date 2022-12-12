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
  source2resource_id: (rule_id, source_id) => {
    return sparkmd5.hash(`${rule_id}-${source_id}`);
  },
  parseURL2params: (rule, url) => {
    const { pathname } = new URL(url);
    let params = null;
    for (let i = 0; i < rule.patterns.length; i++) {
      const match_url = rule.patterns[i];
      const fn = match(new URL(match_url).pathname || '', { decode: decodeURIComponent });
      const params = fn(pathname);
      if (params.params) {
        params = params.params;
        break;
      }
    }
    return params;
  },
}