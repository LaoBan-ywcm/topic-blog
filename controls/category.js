/**
 * Created by hp-pc on 2017/6/16 0016.
 */
var Article = require('../modules/article');
var Category = require('../modules/category');
var User = require('../modules/user');

//增加分类页
exports.new = function (req, res) {
    res.render('addCategory', {
        title: '增加文章分类'
    });
};

//保存增加的分类
exports.save = function (req, res) {
    var _name = req.body.name;
    var categoryObj = new Category({name: _name});
    categoryObj.save(function (err, category) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/categoryList');
    })
};

//分类列表
exports.categoryList = function (req, res) {
    res.locals.user = req.session.user;
    Category.find({}, function (err, categories) {
        res.render('categoryList', {
            categories: categories,
            title: '文章分类'
        });
    });
};


exports.index = function (req, res) {
    res.locals.user = req.session.user;
    var currentPage = req.query.p || 1;
    var count = 2;


    //显示分类
    Category.find({}, function (err, categories) {
        if (err) {
            console.log(err);
        }


        //    显示文章
        Article.find({})
            .populate('author category')
            .exec(function (err, articles) {
                console.log(articles.length);




                res.render('index', {
                    //限制显示的文章数
                    articles: articles.slice((currentPage-1)*count,(currentPage-1)*count+2),
                    categories: categories,
                    totalPage:Math.floor(articles.length/count),
                    currentPage:currentPage,
                    title: '首页'
                })
            })

    });






};
