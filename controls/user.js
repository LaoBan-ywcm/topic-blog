/**
 * Created by hp-pc on 2017/6/16 0016.
 */
var User = require('../modules/user');
var email = require('./email');
var path = require('path');
var fs =require('fs');



//用户登录
exports.signin = function (req, res, next) {
    var _user = req.body.user;
    var userObj = new User(_user);

    User.findOne({name: userObj.name}, function (err, user) {

        if (err) {
            console.log(err);
        }

        if (!user) {
            res.render('info', {
                title: '用户登录状态',
                message: '没有该用户'
            });
            return console.log('没有该用户');
        }

        if (user.password === userObj.password) {
            console.log("用户登录成功");
            req.session.user = user;
            res.redirect('/');
        } else {
            console.log("用户密码错误");
            res.render('info', {
                title: '用户登录状态',
                message: '用户密码错误'
            });
        }
    })

};

//用户上传头像
exports.headPosterSave = function (req, res, next) {
    var picture = req.files.headPortrait;
    var filePath = picture.path;
    var fileType = picture.type.split('/')[1];
    var fileName = picture.originalFilename;

    if(fileName){
        fs.readFile(filePath,function(err,data){
            var time = Date.now();
            var newPicture = time + '.' + fileType;
            var newPath = path.join(__dirname,'../','/public/images/user/' + newPicture);

            fs.writeFile(newPath,data,function(err){
                if(err){
                    console.log(err);
                }
                req.headPortrait = newPicture;
                next();
            })
        })
    }else{
        next();
    }

};

//用户注册
exports.signup = function (req, res, next) {
    var _user = req.body.user;
    if(req.headPortrait){
        _user.headPortrait = req.headPortrait;
    }
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
                res.redirect('/');
            })
        }
    })

};

//用户登出
exports.logout = function (req, res) {
    delete req.session.user;
    res.redirect('/');
};

//用户列表
exports.userList = function (req, res) {
    res.locals.user = req.session.user;
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }

        res.render('userlist', {
            title: '用户列表页',
            users: users
        });
    });
};

//用户信息
exports.userInfo = function (req, res) {
    res.locals.user = req.session.user;
    var _user = res.locals.user;
    User.findOne({name: _user.name})
        .populate({
            path: 'articles',
            select: '',
            model: 'Article',
            populate: {
                path: 'category',
                select: 'name',
                model: 'Category'
            }
        })
        .exec(function (err, user) {
            if (err) {
                console.log(err)
            }

            res.render('userinfo', {
                title: '个人详情',
                user: user,
                articles: user.articles
            })
        })
};

//更改密码
exports.updateUserInfo = function (req, res) {
    var userObj = res.locals.user = req.session.user;
    var _user = req.body.user;
    User.findOne({name: userObj.name}, function (err, user) {
        if (err) {
            console.log(err);
        }

        if (user.password === _user.oldpassword) {
            user.password = _user.newpassword;
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                }
                res.render('info', {
                    title: '密码修改状态',
                    message: '密码修改成功'
                });
            })
        } else {
            res.render('info', {
                title: '密码修改状态',
                message: '旧密码输入错误'
            });
            return console.log('旧密码输入错误');
        }
    })

};

//找回密码
exports.passwordretireval = function (req, res) {
    res.render('passwordretireval', {title: '找回密码'});
};

//发送邮件
exports.sendEmail = function (req, res) {
    var userName = req.body.user.name;
    var userEmail = req.body.user.email;
    User.findOne({name: userName}, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user && user.email == userEmail) {
            var options = {
                from: '2459007415@qq.com',
                to: user.email,
                subject: '博客验证码',
                text: '您的博客密码：' + user.password
            };
            //发送邮件
            email.sendMail(options, function (err, info) {
                if (err) {
                    return console.log(err);
                }
                console.log('Message sent: ' + info.response);
                res.render('info', {
                    title: '找回密码',
                    message: '密码已近发送，请注意查收'
                });
            });
        } else {
            console.log('用户信息填写错误');
            res.render('info', {
                title: '找回密码',
                message: '用户信息填写错误'
            });
        }
    })
};

//验证用户是否登录
exports.signinRequired = function (req, res, next) {
    res.locals.user = req.session.user;
    if (!res.locals.user) {
        return res.render('signin', {
            title: '登录'
        });
    }
    next();

};

exports.ssignup = function (req, res) {
    res.locals.user = req.session.user;
    res.render('signup', {
        title: '注册'
    });
};

exports.ssignin = function (req, res) {
    res.locals.user = req.session.user;
    res.render('signin', {
        title: '登录'
    });
};
