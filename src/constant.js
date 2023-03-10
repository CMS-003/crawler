module.exports = {
  RECORD: {
    STATUS: {
      // 已创建
      CREATED: 1,
      // 处理中
      DEALING: 2,
      // 已完成
      SUCCESS: 3,
      // 出错了
      ERRORED: 4,
      // 已停止
      STOPPED: 5,
    },
    UPDATE_STATUS: {
      UPDATING: 1,
      FINISHED: 0,
    }
  },
  RULE: {
    STATUS: {
      CREATED: 0,
      RUNNING: 1,
      DISCARD: 2,
      WAITING: 3,
    }
  },
  ATTACHMENT: {
    STATUS: {
      CREATED: 1,
      DOWNLOADING: 2,
      TRANSCODING: 3,
      SUCCESS: 4,
      ERRORED: 5,
    }
  },
  VIDEO: {
    // 正片: feature 预告片: trailer 花絮: tidbits 短视频: short 一般短片 video
    TYPE: {
      FEATURE: 1,
      TRAILER: 2,
      TIDBITS: 3,
      SHORT: 4,
      VIDEO: 5,
    }
  }
}