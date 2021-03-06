/**
 * Created by hp-pc on 2017/6/16 0016.
 */
var Article = require('../modules/article');
var Category = require('../modules/category');
var User = require('../modules/user');

//增加分类页
exports.new = function (req, res) {
    res.locals.user = req.session.user;
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

//首页
exports.index = function (req, res) {
    res.locals.user = req.session.user;
    var currentPage = req.query.p || 1;
    //每页显示的数量
    var count = 4;




    //显示分类
    Category.find({}, function (err, categories) {
        if (err) {
            console.log(err);
        }


        //    显示文章
        Article.find({})
            .sort({'meta.updateAt':-1})
            .populate('author category')
            .exec(function (err, articles) {

                User.find({role:0})
                    .sort({'meta.updateAt':-1})
                    .exec(function(err,users){
                        if(err){
                            console.log(err)
                        }


                        res.render('index', {
                            //限制显示的文章数
                            articles: articles.slice((currentPage - 1) * count, (currentPage - 1) * count + count),
                            categories: categories,
                            totalPage: Math.ceil(articles.length / count),
                            currentPage: currentPage,
                            users:users
                        })

                    })

            })

    });


};


//文章分类显示
exports.detail = function (req, res) {
    var cId = req.query.cId;
    res.locals.user = req.session.user;
    var currentPage = req.query.p || 1;
    var count = 4;

    //头部导航
    Category.find({}).exec(function (err, categories) {


        //分类的文章
        Article.find({category: cId})
            .sort({'meta.updateAt':-1})
            .populate('author category')
            .exec(function (err, articles) {
                if (err) {
                    console.log(err)
                }



                if(articles.length > 0){
                    res.render('categoryDetail', {
                        articles: articles.slice((currentPage - 1) * count, (currentPage - 1) * count + count),
                        title: articles[0].category.name,
                        cId:cId,
                        totalPage: Math.ceil(articles.length / count),
                        currentPage: currentPage,
                        categories: categories
                    })
                }else{
                    res.render('categoryDetail',{
                        title:'该分类下没有文章',
                        categories: categories
                    })
                }


            })
    });


};
