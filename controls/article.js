/**
 * Created by hp-pc on 2017/6/16 0016.
 */
var Article = require('../modules/article');
var Category = require('../modules/category');
var User = require('../modules/user');

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

//保存文章
exports.save = function (req, res) {
    var _article = req.body.article;
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
exports.articleList = function(req,res){
    res.locals.user = req.session.user;
    Article.find({})
        .populate('author category')
        .exec(function(err,articles){
            res.render('articlelist',{
                articles:articles
            })
        })
};

//用户详情
exports.detail = function(req,res){
  var id = req.params.id;


    Article.findOne({_id:id})
        .populate('author category')
        .exec(function(err,article){
            console.log(article)
            res.render('articleDetail',{
                article:article
            })
        })
};