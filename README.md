# 说明

## 设计
- 同个网站有多域名: rule表hosts字段改为数组
- 保存原始获取的数据 raw字段
- rule => record => 下载转码 => resource