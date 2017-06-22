/**
 * Created by hp-pc on 2017/6/20 0020.
 */
var Article = require('../modules/article');
var Category = require('../modules/category');
var User = require('../modules/user');
var Comment = require('../modules/comment');

exports.new = function (req, res) {
    res.locals.user = req.session.user;
    var _comment = req.body;
    if(_comment.cId){
    //    评论某个人的评论
        Comment.findOne({_id:_comment.cId},function(err,comment){
            if(err){
                console.log(err)
            }
            var reply = {
                from:res.locals.user._id,
                to:_comment.reply.to,
                content:_comment.reply.content
            };
            comment.reply.push(reply);
            comment.save(function(err,comment){
                if(err){
                    console.log(err)
                }

                Comment.findOne({_id:comment._id})
                    .populate({
                        path:'reply.from reply.to',
                        select:''
                    })
                    .exec(function(err,comment){
                        var responseData = {};
                        responseData.success = 1;
                        responseData.data = comment.reply[comment.reply.length-1];
                        console.log('123')
                        res.json(responseData);
                    })


            })
        })
    }else{
        console.log('评论文章');
    //    评论文章
        _comment.from = res.locals.user._id;

        var comment = new Comment(_comment);

        comment.save(function(err,comment){

            if(err){
                console.log(err);
            }


            //将评论添加到文章的comment中
            Article.findOne({_id:comment.article},function (err,article) {
                article.comment.push(comment._id);
                article.save(function(err,article){
                    if(err){
                        console.log(err)
                    }
                })
            });



            Comment.findOne({_id:comment._id})
                .populate('from')
                .exec(function(err,comment){
                    var responseData = {};
                    responseData.success = 1;
                    responseData.data = comment;
                    res.json(responseData);
                });

        })
    }


};