var express = require('express');
var router = express.Router();
var User = require('../controls/user');
var Article = require('../controls/article');
var Category = require('../controls/category');


/* GET home page. */
router.get('/', Category.index);

//用户登录
router.post('/users/signin', User.signin);

//用户注册
router.post('/users/signup', User.signup);

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
router.get('/user/addArticle',Article.new);
router.post('/user/addArticle',Article.save);

//文章列表
router.get('/user/articleList',Article.articleList);

//文章详情
router.get('/article/:id',Article.detail);

//删除文章
router.delete('/user/delete/article',Article.delete);




module.exports = router;
