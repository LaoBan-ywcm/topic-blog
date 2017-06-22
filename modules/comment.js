/**
 * Created by hp-pc on 2017/6/20 0020.
 */
var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
var Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;