/**
 * Created by hp-pc on 2017/6/16 0016.
 */
var Article = require('../modules/article');
var Category = require('../modules/category');
var User = require('../modules/user');
var Comment = require('../modules/comment');
var path = require('path');
var fs = require('fs');

exports.new = function (req, res) {
    res.locals.user = req.session.user;
    Category.find({}, function (err, categories) {
        if (err) {
            console.log(err);
        }
        if (categories) {
            res.render('addArticle', {
                categories: categories
            });
        } else {
            console.log('没有分类');
        }
    });
};

//保存图片
exports.pictureSave = function(req,res,next){

    var picture = req.files.picture;
    var filePath = picture.path;
    var fileType = picture.type.split('/')[1];
    var fileName = picture.originalFilename;

    if(fileName){
        fs.readFile(filePath,function(err,data){
            var time = Date.now();
            var newPicture = time + '.' + fileType;
            var newPath = path.join(__dirname,'../','/public/images/' + newPicture);

            fs.writeFile(newPath,data,function(err){
                if(err){
                    console.log(err);
                }
                req.picture = newPicture;
                next();
            })
        })
    }else{
        next();
    }
};

//保存文章
exports.save = function (req, res) {
    var _article = req.body.article;
    console.log('****');
    console.log(req.picture);


    if(req.picture){
        _article.picture = req.picture;
    }

    var articleObj = new Article(_article);


    articleObj.save(function (err, article) {
        // 保存文章
        if (err) {
            console.log(err);
        }


        // 文章保存完后，将该文章添加到分类中
        Category.findOne({_id: article.category}, function (err, category) {
            category.articles.push(article._id);
            category.save(function (err, category) {
                if (err) {
                    console.log(err);
                }


                //   文章添加到分类后，将文章添加到作者名下

                User.findOne({_id: article.author}, function (err, user) {
                    user.articles.push(article._id);
                    user.save(function (err, category) {
                        if (err) {
                            console.log(err);
                        }

                        res.redirect('/');
                    })
                });
            });
        });
    });
};

//用户列表
exports.articleList = function (req, res) {
    res.locals.user = req.session.user;
    Article.find({})
        .populate('author category')
        .exec(function (err, articles) {
            res.render('articlelist', {
                articles: articles
            })
        })
};

//文章详情
exports.detail = function (req, res) {
    res.locals.user = req.session.user;
    var id = req.params.id;


    Category.find({},function(err,categories){
        if(err){
            console.log(err)
        }

        Article.findOne({_id: id})
            .populate({
                path:'author category comment',
                select:'',
                populate:{
                    path:'from reply.from reply.to',
                    select:''
                }
            })
            .exec(function (err, article) {
                res.render('articleDetail', {
                    article: article,
                    comments:article.comment,
                    categories:categories,
                    title:article.title
                })
            })
    });



};

//删除文章
exports.delete = function (req, res) {
    var articleId = req.query.id;
    if (articleId) {
        Article.findOne({_id: articleId}, function (err, article) {

            // 从该用户的articles中删除该文章
            User.findOne({_id: article.author}, function (err, user) {
                if (err) {
                    console.log(err)
                }

                user.articles.removeByValue(articleId);
                user.save(function (err, user) {

                });

                //从分类中删除该文章
                Category.findOne({_id: article.category}, function (err, category) {
                    if (err) {
                        console.log(err)
                    }

                    category.articles.removeByValue(articleId);
                    category.save(function (err, category) {
                        if(err){
                            console.log(err)
                        }
                    });


                    //    从article集合中删除该文章
                    Article.remove({_id: articleId}, function (err, article) {
                        if (err) {
                            console.log(err);
                            res.json({success: 0});
                        } else {
                            res.json({success: 1});
                        }
                    });
                });

            });

        });
    }
};