/**
 * 小程序配置文件
 */
// var host = 'https://www.hatank.com/app/api';
var host = 'http://localhost:5000/api';
var config = {
  apis: {
        host,
        initDb: `${host}/initDb`,
        initMenus: `${host}/initMenus`,
        sendCode: `${host}/sendCode`,
        picCode: `${host}/picCode`,
        isLogined:`${host}/isLogined`,
        users:{
          // 用户注册
          register: `${host}/users/register`,
          // 用户信息查询
          query: `${host}/users/query`,
          // 用户登录
          login: `${host}/users/login`,
          // 手机号登录
          phone: `${host}/users/phone`,
          // 微信号登录
          weixin: `${host}/users/weixin`,
          // 用户信息修改
          update: `${host}/users/update`,
          // 文件上传
          upload: `${host}/users/upload`,         
          // 新建菜谱图片上传和数据提交
          uploadNew: `${host}/users/uploadNew`,     
          // 用户关注
          focus: `${host}/users/focus`,
          // 未关注
          unfocus: `${host}/users/unfocus`,
        },
        category:{
          // 条件查询
          search: `${host}/search`,
          // 查询菜谱分类
          query: `${host}/query`,
          // 查询单个菜谱分类下的菜单列表
          categoryByCid: `${host}/category/cid`,
          // 查询id对应菜种详情
          detailById: `${host}/category/id`,
          //菜谱管理 添加/删除
          manger: `${host}/category/manger`,
          //新建菜谱
          new: `${host}/category/new`,
          // 关注菜谱+取消关注+关注外的其他分类
          interest: `${host}/category/interest`,
          // 看过菜谱
          history: `${host}/category/history`,
          // 收藏菜谱+取消收藏
          cookie: `${host}/category/cookie`,
          // 点赞菜谱
          agree: `${host}/category/agree`,
          // 菜谱评分
          score: `${host}/category/score`,
          // 菜谱评论管理
          commented: `${host}/category/commented`,
        },
        topics:{
          // 新增话题
          add: `${host}/topics/add`,
          // 看过
          history: `${host}/topics/history`,
          // 收藏过
          cookie: `${host}/topics/cookie`,
          // 话题查询
          query: `${host}/topics/query`,
          // 话题详情
          id: `${host}/topics/id`,          
        }
    }
};
module.exports = config;
