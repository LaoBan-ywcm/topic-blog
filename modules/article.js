/**
 * Created by hp-pc on 2017/6/16 0016.
 */
var mongoose = require('mongoose');
var ArticleSchema = require('../schemas/article');
var Article = mongoose.model('Article',ArticleSchema);

module.exports = Article;