var express = require('express');
var router = express.Router();
var User = require('../modules/user');
var email = require('../controls/email');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.locals.user = req.session.user;
    res.render('index', {title: 'Express'});
});

//用户登录
router.post('/users/signin', function (req, res, next) {
    var _user = req.body.user;
    var userObj = new User(_user);

    User.findOne({name: userObj.name}, function (err, user) {

        if (err) {
            console.log(err);
        }

        if (!user) {
            res.redirect('/');
            return console.log('没有该用户');
        }

        if (user.password === userObj.password) {
            console.log("用户登录成功");
            req.session.user = user;
            res.redirect('/admin/userlist');
        } else {
            console.log("用户密码错误");
            res.redirect('/');
        }
    })

});

//用户注册
router.post('/users/signup', function (req, res, next) {
    var _user = req.body.user;
    var userObj = new User(_user);

    User.findOne({name: userObj.name}, function (err, user) {
        if (err) {
            console.log(err);
        }

        //如果用户存在
        if (user) {
            res.redirect('/')
        } else {
            //  如果用户不存在
            userObj.save(function (err, user) {
                if (err) {
                    console.log(err)
                }
                console.log(user);
                res.redirect('/');
            })
        }
    })

});

router.get('/user/logout',function(req,res){
    delete req.session.user;
    res.redirect('/');
});

//用户列表
router.get('/admin/userlist',function(req,res){
    res.locals.user = req.session.user;
    User.fetch(function(err,users){
        if(err){
            console.log(err);
        }

        res.render('userlist',{
            title:'用户列表页',
            users:users
        });
    });
});

//用户信息
router.get('/user/userinfo',function(req,res){
    res.locals.user = req.session.user;
    var _user = res.locals.user;
    User.findOne({name:_user.name},function (err,user) {
        if(err){
            console.log(err);
        }

        res.render('userinfo',{
            user:user,
            title:'个人资料'
        });
    })
});

//更改密码
router.post('/user/update/userinfo',function(req,res){
   var userObj = res.locals.user = req.session.user;
   var _user = req.body.user;
   User.findOne({name:userObj.name},function(err,user){
       if(err){
           console.log(err);
       }

       if(user.password === _user.oldpassword){
           user.password = _user.newpassword;
           user.save(function(err,user){
               if(err){
                   console.log(err);
               }
               res.render('userinfo',{message:'修改成功'});
           })
       }else{
           res.render('userinfo',{message:'旧密码输入错误'});
           return console.log('旧密码输入错误');
       }
   })

});

//找回密码
router.get('/user/passwordretireval',function(req,res){
        res.render('passwordretireval',{title:'找回密码'});
    });

//发送邮件
router.post('/user/sendEmail',function(req,res){
    var userName = req.body.user.name;
    var userEmail = req.body.user.email;
    User.findOne({name:userName},function(err,user){
        if(err){
            console.log(err);
        }
        if(user && user.email == userEmail){
            var options = {
                from:'2459007415@qq.com',
                to:user.email,
                subject:'博客验证码',
                text:'您的博客密码：' + user.password
            };
            //发送邮件
            email.sendMail(options, function (err, info) {
                if (err) {
                    return console.log(err);
                }
                console.log('Message sent: ' + info.response);
                res.redirect('/');
            });
        }else{
            console.log('用户信息填写错误');
            res.redirect('/');
        }
    })
});

module.exports = router;
