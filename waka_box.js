// 引入fs模块和https模块
const fs = require('fs');
const https = require('https');

// 定义url和文件名
const url = 'https://gist.githubusercontent.com/12ain/6c32e8110d26792b782f6650b9c71e44/raw/883a8ec2e888e25c6a699f29f498ea07ecc3358a/%25F0%259F%2593%258A%2520Weekly%2520development%2520breakdown';
const filename = 'README.md';

// 定义一个函数，用于获取url的文本内容
function getText(url, callback) {
  // 发送https请求
  https.get(url, (res) => {
    // 设置编码为utf-8
    res.setEncoding('utf-8');
    // 定义一个变量，用于存储响应数据
    let data = '';
    // 监听data事件，拼接响应数据
    res.on('data', (chunk) => {
      data += chunk;
    });
    // 监听end事件，调用回调函数
    res.on('end', () => {
      callback(data);
    });
  }).on('error', (err) => {
    // 处理错误
    console.error(err.message);
  });
}

// 定义一个函数，用于将文本内容插入到文件的<!-- waka-box start --> <!-- waka-box end -->标签中
function insertText(filename, text, callback) {
  // 读取文件内容
  fs.readFile(filename, 'utf-8', (err, data) => {
    if (err) {
      // 处理错误
      console.error(err.message);
    } else {
      // 定义一个正则表达式，用于匹配<!-- waka-box start --> <!-- waka-box end -->标签
      const regex = /<!-- waka-box start -->([\s\S]*?)<!-- waka-box end -->/;
      // 替换标签中的内容为text，并添加换行符
      const newData = data.replace(regex, `<!-- waka-box start -->\n${text}\n<!-- waka-box end -->`);
      // 写入新的文件内容
      fs.writeFile(filename, newData, 'utf-8', (err) => {
        if (err) {
          // 处理错误
          console.error(err.message);
        } else {
          // 调用回调函数
          callback();
        }
      });
    }
  });
}

// 调用getText函数，传入url和一个匿名函数作为参数
getText(url, (text) => {
  // 调用insertText函数，传入filename, text和一个匿名函数作为参数
  insertText(filename, text, () => {
    // 打印成功信息
    console.log('插入成功！');
  });
});