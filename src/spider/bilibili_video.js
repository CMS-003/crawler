const BiliHelper = require('../../plugins/biliOperation');
const utils = require('../../utils');
const url = require('url')

module.exports = async function ({ app, config: ruleConfig, params, preview = false }) {
  const { resourceBLL, taskBLL, mediaVideoBLL } = app.get('mongoBLL');
  const m = /\/video\/([a-zA-Z0-9-_]+)$/.exec(url.parse(params.origin).pathname)
  const avbv = m ? m[1] : '';
  const id = utils.md5(params.origin);
  // https://www.bilibili.com/video/BV1Wv41177cW
  if (ruleConfig && avbv) {
    const item = await resourceBLL.getInfo({ where: { source_id: avbv, } })
    if (item) {
      throw ('数据已存在')
    }
    const info = await BiliHelper.getVideoInfo(avbv);
    let poster = info.pic;
    if (poster && !preview) {
      const fullsub = await utils.createUrlPath('/images/poster/{YY}-{MM}-{DD}/{HH}{II}{SS}-{6}.{ext}', app.config.STATIC_PATH, poster);
      const taskId = utils.GUID();
      await taskBLL.create({ id: taskId, name: `封面：${info.title}`, type: 'image', resource_id: id, origin: poster, params: { dirpath: app.config.STATIC_PATH, subpath: fullsub.subpath } });
      poster = fullsub.subpath;
      try {
        await utils.shttp.download(info.pic, fullsub.fullpath);
        await taskBLL.update({ where: { id: taskId }, data: { $set: { status: 'finished' } } })
      } catch (e) {
        await taskBLL.update({ where: { id: taskId }, data: { $set: { status: 'retry' } } })
        console.log(e)
      }
    }
    const data = {
      id,
      title: info.title,
      uid: 1,
      uname: '',
      desc: info.desc,
      tags: [],
      source_type: ruleConfig.type,
      source_id: avbv,
      source_name: 'bilibili',
      url: params.origin,
      open: true,
      poster,
      images: [],
      publishedAt: new Date(info.ctime * 1000),
      createdAt: new Date(),
      status: 'finished',
      original: info,
    }
    const arrVideos = [], arrTasks = [];
    for (let i = 0; i < info.pages.length; i++) {
      const result = await BiliHelper.getPlayUrl({ id: info.aid, cid: info.pages[i].cid })
      const result2 = await BiliHelper.getTags({ id: info.aid, cid: info.pages[i].cid })
      if (result.code === 0) {
        // arrVideos.push({
        //   updateOne: {
        //     filter: { mid: id, id: utils.MUID(i, id), },
        //     update: { $set: { title: info.pages[i].part || '', more: info.pages[i].dimension, } },
        //     upsert: true,
        //   }
        // });
        if (i == 0) {
          data.tags = result2.code === 0 ? result2.data.map(item => item.tag_name) : [];
        }
        arrTasks.push({
          updateOne: {
            filter: { resource_id: id, id: utils.MUID(i, id) },
            // TODO: 默认1080p
            update: { $set: { type: 'video', params: result.data, origin: result.data.durl[0].url, name: info.title } },
            upsert: true,
          }
        });
      }
    }
    if (preview) {
      return data;
    }
    await resourceBLL.create(data)
    // await mediaVideoBLL.model.bulkWrite(arrVideos);
    await taskBLL.model.bulkWrite(arrTasks)
  } else {
    app.getLogger2('spider').action(`fetch`).log({
      url: params.origin, ruleId: ruleConfig.id,
    });
  }
}