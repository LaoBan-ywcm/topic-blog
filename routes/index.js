var express = require('express');
var router = express.Router();
var User = require('../controls/user');
var Article = require('../controls/article');
var Category = require('../controls/category');
var Comment = require('../controls/comment');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


/* GET home page. */
router.get('/', Category.index);

//用户登录处理
router.post('/users/signin', User.signin);

//用户注册处理
router.post('/users/signup',User.headPosterSave, User.signup);

//用户登录页面
// router.get('/user/signin',User.ssignin);

//用户注册页面
// router.get('/user/signup',User.ssignup);


//用户登出
router.get('/user/logout',User.logout);

//用户列表
router.get('/admin/userlist',User.userList);

//用户信息
router.get('/user/userinfo',User.userInfo);

//更改密码
router.post('/user/update/userinfo',User.updateUserInfo);

//找回密码
router.get('/user/passwordretireval',User.passwordretireval);

//发送邮件
router.post('/user/sendEmail',User.sendEmail);


router.get('/admin/addCategory',Category.new);
router.post('/admin/addCategory',Category.save);

//分类列表
router.get('/admin/categoryList',Category.categoryList);

//增加文章
router.get('/user/addArticle',User.signinRequired,Article.new);
router.post('/user/addArticle',Article.pictureSave,Article.save);

//文章列表
router.get('/user/articleList',Article.articleList);

//文章详情
router.get('/article/:id',Article.detail);

//删除文章
router.delete('/user/delete/article',Article.delete);

//文章分类显示
router.get('/category',Category.detail);

//评论文章
router.post('/user/comment',Comment.new);




module.exports = router;
