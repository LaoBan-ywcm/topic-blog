/**
 * Created by hp-pc on 2017/6/16 0016.
 */
var mongoose = require('mongoose');
var CategorySchema = require('../schemas/category');
var Category = mongoose.model('Category',CategorySchema);

module.exports = Category;