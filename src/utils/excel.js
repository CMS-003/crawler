const _ = require('lodash');
const XLSX = require('xlsx');

function data2sheet(header, data) {
  data = _.keyBy(_.flatMap(data.map((v, i) => header.map((k, j) => { return { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) }; }))), 'position');
  header = _.keyBy(header.map((v, i) => { return { v: v, position: String.fromCharCode(65 + i) + 1 }; }), 'position');
  // 合并 header 和 data
  const output = Object.assign({}, header, data);
  // 获取所有单元格的位置
  const outputPos = Object.keys(output);
  // 计算出范围
  const ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
  return Object.assign({}, output, { '!ref': ref });
}

module.exports = {
  parse(filepath) {
    const wb = XLSX.readFile(filepath);
    const pages = [];
    XLSX.utils.sheet_to_json(wb);
    for (let i = 0; i < wb.SheetNames.length; i++) {
      const name = wb.SheetNames[i];
      const data = XLSX.utils.sheet_to_json(wb.Sheets[name]);
      pages.push({ name, data });
    }
    return pages;
  },
  create(filepath, pages) {
    let book = {
      SheetNames: [],
      Sheets: {}
    };
    for (let i = 0; i < pages.length; i++) {
      let name = pages[i].name || `Sheet${i + 1}`;
      let data = data2sheet(pages[i].header, pages[i].data);
      book.SheetNames.push(name);
      book.Sheets[name] = data;
    }
    // 导出 Excel
    XLSX.writeFile(book, filepath);
  }
};