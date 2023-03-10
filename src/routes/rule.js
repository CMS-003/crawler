const _ = require('lodash');
const constant = require('../constant')
const { match } = require("path-to-regexp");
const helper = require('../utils/helper');
const { NodeVM, VMScript } = require('vm2');

module.exports = (app) => {
  const spiders = {};
  const models = app.models;
  const vm = new NodeVM({
    console: 'inherit',
    nesting: true,
    require: {
      external: true,
      builtin: ['*'],
      root: app.config.APP_PATH,
    },
    sandbox: { app }
  });

  return {
    'get /rules': async (req, res) => {
      const hql = req.paging();
      const items = await models.Rule.getList(hql)
      res.success(items);
    },
    'post /rules': async (req, res) => {
      const data = _.pick(req.body, ['type', 'name', 'desc', 'script', 'patterns', 'status', '_id']);
      try {
        new VMScript(data.script).compile();
      } catch (e) {
        return res.fail('脚本预编译失败');
      }
      await models.Rule.create(data);
      res.success({ _id: data._id });
    },
    'post /rules/detect': async (req, res) => {
      const url = new URL(req.query.url);
      const { origin, pathname } = url;
      let result;
      const rules = await models.Rule.getAll({ where: { status: constant.RULE.STATUS.RUNNING, prefix: { $elemMatch: { $regex: new RegExp('^' + origin) } } }, lean: true })
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j];
        let matched = false;
        for (let i = 0; i < rule.patterns.length; i++) {
          const match_url = rule.patterns[i];
          const fn = match(new URL(match_url).pathname || '', { decode: decodeURIComponent });
          const params = fn(pathname);
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
        let code = 0, message = '匹配到规则但没数据';
        const record = await models.Record.findOne({ rule_id: result._id, source_id: result.params.id })
        if (record) {
          switch (record.status) {
            case constant.RECORD.STATUS.CREATED:
              code = 12;
              break;
            case constant.RECORD.STATUS.DEALING:
              message = '抓取数据中...';
              code = 13;
              break;
            case constant.RECORD.STATUS.ERRORED:
              code = -1;
              message = '抓取失败';
              break;
            case constant.RECORD.STATUS.STOPPED:
              code = -1;
              message = '已停止抓取该资源';
              break;
            case constant.RECORD.STATUS.SUCCESS:
              code = 0;
              message = '抓取数据成功';
              break;
            default:
              code = -1;
              break;
          }
        } else {
          // 匹配到规则但没数据
          code = 12;
        }
        res.json({ code, message, data: result });
      } else {
        // 未匹配到规则
        res.json({ code: 11, message: '未匹配到规则' })
      }
    },
    'put /rules/:id': async (req, res) => {
      const data = _.pick(req.body, ['type', 'name', 'desc', 'script', 'patterns', 'status']);
      if (typeof data.script !== undefined) {
        try {
          new VMScript(data.script).compile();
        } catch (e) {
          console.log(e);
          return res.fail('脚本预编译失败');
        }
      }
      await models.Rule.updateOne({ _id: req.params.id }, { $set: data });
      res.success();
    },
    'patch /rules/:id': async (req, res) => {
      const rule = await models.Rule.findOne({ _id: req.params.id });
      const url = req.query.origin, preview = req.query.preview ? true : false;
      if (!rule) {
        res.fail('no rule');
      } else {
        let script = spiders[rule._id]
        if (script === undefined) {
          script = new VMScript(rule.script || '', app.config.APP_PATH + `/spiders/${rule._id}.js`).compile();
          spiders[rule._id] = script;
        }
        if (!script) {
          return res.fail("脚本错误");
        }
        const fn = vm.run(script);
        if (typeof fn !== 'function') {
          return res.fail('脚本不是函数');
        }
        try {
          const data = await fn(rule, url, preview)
          res.success(data);
        } catch (e) {
          res.fail(`抓取失败: ${e.message}`);
        }
      }
    },
  }
};