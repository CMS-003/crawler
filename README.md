# 说明

## 设计
- 同个网站有多域名: rule表hosts字段改为数组
- 保存原始获取的数据 raw字段
- resource_id通过rule_id和source_id生成。rule_id改为手写唯一标志。
- rule => record => 下载转码 => resource
- 异步文件的处理方式
  - 网页内的图片视频，附件占位。发布时组装后发布
  - /attachment/:id 方式无需后缀
