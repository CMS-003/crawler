const _ = require('lodash');
const uuid = require('uuid');
const config = require('../config')
const crypto = require('crypto')
const models = require('../db/index');
const constant = require('../constant')
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");
const helper = require('../utils/helper');


module.exports = (app) => {
  return {
    'get /rules': async (req, res) => {
      const hql = req.paging();
      const items = await models.Rule.getList(hql)
      res.success(items);
    },
    'post /rules': async (req, res) => {
      const data = _.pick(req.body, ['type', 'name', 'desc', 'filepath', 'matches', 'status', '_id']);
      data._id = uuid.v4();
      await models.Rule.create(data);
      res.success({ _id: data._id });
    },
    'post /rules/detect': async (req, res) => {
      const url = new URL(req.query.url);
      const { origin, pathname } = url;
      let result;
      const rules = await models.Rule.getAll({ where: { status: constant.RULE.STATUS.RUNNING, matches: { $elemMatch: { $regex: new RegExp('^' + origin) } } }, lean: true })
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j];
        let matched = false;
        for (let i = 0; i < rule.matches.length; i++) {
          const match_url = rule.matches[i];
          const fn = match(new URL(match_url).pathname || '', { decode: decodeURIComponent });
          const params = fn(pathname);
          console.log(params)
          if (params.params) {
            matched = true;
            result = rule;
            result.params = params.params;
            break;
          }
        }
        if (matched) {
          break;
        }
      }
      if (result) {
        let code = 0;
        const record = await models.Record.findOne({ rule_id: result._id, source_id: result.alg_type === 'params' ? params2id(result.params) : crypto.createHash('md5').update(pathname).digest('hex') })
        if (record) {
          switch (record.status) {
            case constant.RECORD.STATUS.CREATED:
              code = 12;
              break;
            case constant.RECORD.STATUS.DEALING:
              code = 13;
              break;
            case constant.RECORD.STATUS.ERRORED:
              code = -1;
              break;
            case constant.RECORD.STATUS.STOPPED:
              code = -1;
              break;
            case constant.RECORD.STATUS.SUCCESS:
              code = 0;
              break;
            default:
              code = -1;
              break;
          }
        } else {
          // 匹配到规则但没数据
          code = 12;
        }
        res.json({ code, data: result });
      } else {
        // 未匹配到规则
        res.json({ code: 11 })
      }
    },
    'put /rules/:id': async (req, res) => {
      const data = _.pick(req.body, ['type', 'name', 'desc', 'filepath', 'matches', 'status']);
      await models.Rule.updateOne({ _id: req.params.id }, { $set: data });
      res.success();
    },
    'patch /rules/:id': async (req, res) => {
      const rule = await models.Rule.findOne({ _id: req.params.id });
      if (!rule) {
        res.fail('no rule');
      } else if (helper.isFileExists(`${config.APP_PATH}${rule.filepath}`)) {
        const fn = require(`${config.APP_PATH}${rule.filepath}`)
        fn(rule, req.query.url);
        res.success();
      } else {
        res.fail('no script file');
      }
    },
  }
};