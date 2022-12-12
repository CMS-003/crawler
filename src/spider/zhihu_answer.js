const _ = require('lodash');
const got = require('got').default;
const models = require('../db/index')
const { match } = require("path-to-regexp");
const { v4 } = require('uuid');
const helper = require('../utils/spider.helper');
const constant = require('../constant');
const cheerio = require('cheerio');

function extractHTML(html, attachments) {
  const $ = cheerio.load(html);
  const images = $('figure');
  images.each((i, figure) => {
    const elem = $(figure).find('img');
    const title = $(figure).find('figcaption').text()
    const url = elem.attr('data-original')
    const id = v4()
    attachments.push({ id, title, url, type: 'image' });
    $(elem).replaceWith($(`<attachment data-id="${id}"/>`))
  });

  const videos = $('a.video-box');
  videos.each((i, a) => {
    const url = $(a).find('span.url').text().trim();
    const title = $(a).find('span.title').text().trim();
    const id = v4();
    const cover = $(a).attr('data-poster') || '';
    let cover_id = '';
    attachments.push({
      id, title, url, media_type: 'video',
    });
    if (cover) {
      cover_id = v4();
      attachments.push({
        id: cover_id,
        media_type: 'image',
        url: cover,
      });
    }
    $(a).replaceWith(`<attachment data-id="${id}" cover="${cover_id}"/>`);
  });
  return $('body').html();
}

module.exports = async function (rule, url) {
  const { pathname } = new URL(url);
  for (let i = 0; i < rule.patterns.length; i++) {
    const match_url = rule.patterns[i];
    const fn = match(new URL(match_url).pathname || '', { decode: decodeURIComponent });
    const params = fn(pathname);
    if (params.params) {
      rule.params = params.params;
      break;
    }
  }
  if (_.isEmpty(rule.params)) {
    return;
  }
  const source_id = rule.params.aid;
  const source_type = 'answer';
  const resource_id = helper.genResourceId(source_type, source_id)
  const doc = await models.Record.findOne({ source_id, rule_id: rule._id }).lean();
  if (doc) {
    throw ('数据已存在');
  }
  console.log(`crawler: ${url}`)
  try {
    const question = await got.get(`https://api.zhihu.com/v4/answers/${source_id}/question?include=visit_count,comment_count`, {
      method: 'GET',
    }).json();
    const answer = await got.get(`https://api.zhihu.com/v4/answers/${source_id}?include=attachment,content,created_time,updated_time,author.is_following`, {
      method: 'PATCH',
      headers: {
        "Host": "api.zhihu.com",
        "Accept": "*/*",
        "x-app-bundleid": "com.zhihu.ios",
        "x-app-za": "OS=iOS&Release=15.6.1&Model=iPhone14,5&VersionName=8.41.0&VersionCode=11822&Width=1170&Height=2532&DeviceType=Phone&Brand=Apple&OperatorType=46000",
        "X-Network-Type": "WiFi",
        "X-APP-VERSION": "8.41.0",
        "X-UDID": "AXDQiLlpLxVLBUSuFcgFnOvNuBDUemxisms=",
        "Accept-Language": "zh-Hans-CN;q=1, ja-JP;q=0.9, ko-KR;q=0.8",
        "X-PACKAGE-YTPE": "appstore",
        "X-APP-Build": "release",
      }
    }).json();
    answer.title = question.title;
    const attachments = [];
    const content = extractHTML(answer.content, attachments);
    if (attachments.length) {
      await models.Attachment.bulkWrite(attachments.map(attachment => ({
        updateOne: {
          filter: {
            url: attachment.url,
          },
          update: {
            $set: {
              resource_id,
              title: attachment.title,
              url: attachment.url,
              media_type: attachment.type,
              filepath: '',
              temppath: '',
              more: {},
              createdAt: Date.now(),
              updatedAt: Date.now(),
              status: constant.ATTACHMENT.STATUS.CREATED,
            },
            $setOnInsert: { _id: attachment.id },
          },
          upsert: true,
        },
      })))
    }
    await models.Record.updateOne(
      { source_id, rule_id: rule._id },
      {
        $set: {
          url,
          params: rule.params,
          raw: answer,
          title: answer.title,
          content: content,
          status: constant.RECORD.STATUS.CREATED,
          resource_id,
          source_type,
          creator: {
            name: answer.author.name,
            icon: answer.author.avatar_url,
          },
          region_code: 'zh-CN',
          lang: 'CN',
          createdAt: new Date(answer.created_time * 1000),
          updatedAt: new Date(answer.updated_time * 1000),
          crawledAt: new Date(),
          attachments: attachments.map(item => item.id),
          chapters: 0,
          count: 0,
          retry: 0,
          update_status: constant.RECORD.UPDATE_STATUS.FINISHED,
          available: 0,
        },
        $setOnInsert: { _id: v4() }
      },
      { upsert: true, new: true });
  } catch (e) {
    await models.Record.updateOne({ source_id, rule_id: rule._id }, { $set: { status: constant.RECORD.STATUS.ERRORED }, $setOnInsert: { _id: v4() } }, { upsert: true })
  }
}