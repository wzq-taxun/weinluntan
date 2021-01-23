// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext(); // 获取上下文
  const result = await cloud.openapi.wxacode.getUnlimited({
    // 调用生成小程序码的接口，携带一些参数,例如:scene
    scene: wxContext.OPENID,
  });
  // console.log(result)
  const upload = await cloud.uploadFile({
    // 生成的小程序码上传到云存储中
    cloudPath: 'qrcode/' + Date.now() + '-' + Math.random() + '.png', // 生成的小程序码存储到云存储当中去，路径
    fileContent: result.buffer,
  });
  return upload.fileID; // 返回文件的fileID,也就是该图片
};