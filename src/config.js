const root_path = process.cwd();

module.exports = {
  'PORT': '3335',
  // 项目路径
  'ROOT_PATH': root_path,
  'mongo': {
    'user': 'root',
    'pass': '123456',
    'host': '127.0.0.1',
    'port': '27017',
    'db': 'crawler',
  },
  // 约定目录
  // 应用程序路径,固定写src,想根据NODE_ENV改也可以
  'APP_PATH': `${root_path}/src`,
  // 配置文件路径
  'CONFIG_PATH': `${root_path}/config`,
  // 静态文件路径
  'STATIC_PATH': `${root_path}/static`,
  // 上传文件夹路径
  'UPLOAD_PATH': `${root_path}/upload`,
  // 日志文件路径
  'LOG_PATH': `${root_path}/logs`,
  // 业务错误码路径
  'ERRORS_CODE_PATH': `${root_path}/src/errors-code`,

  // 约定名称
  // 请求约定字段
  'REQ_PAGE': 'page',
  'REQ_LIMIT': 'limit',
  'REQ_SEARCH': 'search',
  'REQ_ORDER': 'order',
  // 约定返回字段
  'RES_SUCCESS': 'success',
  'RES_FAIL': 'fail',
  'RES_STATUS': 'status',
  'RES_DATA': 'data',
  'RES_CODE': 'code',
  'RES_MESSAGE': 'message',
  'RES_STACK': 'stack',
  // 约定分页字段
  'RES_PAGER': 'pager',
  'RES_PAGER_PAGE': 'page',
  'RES_PAGER_PAGES': 'pages',
  'RES_PAGER_LIMIT': 'limit',
  'RES_PAGER_COUNT': 'count',
  'RES_PAGER_TOTAL': 'total',

  // 跨域
  'CORS': {
    'origins': '*',
    'headers': ['X-Token']
  },

  // 多语言
  'i18n': {
    'langs': ['en-us', 'zh-cn'],
    'default': 'zh-cn'
  },

  // 上传
  'UPLOAD': {
    'fileSize': '10mb',
    'fields': 100,
    'fieldNameSize': 255
  },

  // 系统基本信息
  'SYSTEM': {
    'language': 'nodejs',
    'title': '项目'
  },
  'PROJECT_NAME': 'demo'
};
