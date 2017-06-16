/**
 * Created by hp-pc on 2017/6/16 0016.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ArticleSchema = new mongoose.Schema({
    title:{
        unique:true,
        type:String
    },
    introduction:String,
    content:String,
    author:{
        type:ObjectId,
        ref:'User'
    },
    category:{
        type:ObjectId,
        ref:'Category'
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

ArticleSchema.pre('save',function(next){
    var user = this;
    if(user.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next()
});

ArticleSchema.statics = {
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById:function(id,cb){
        return this
            .find({_id:id})
            .exec(cb)
    }
};

module.exports = ArticleSchema;