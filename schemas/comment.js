/**
 * Created by hp-pc on 2017/6/20 0020.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var CommentSchema = new mongoose.Schema({
    article:{
        type:ObjectId,
        ref:"Article"
    },
    from:{
        type:ObjectId,
        ref:"User"
    },
    content:String,
    reply:[{
        to:{
            type:ObjectId,
            ref:"User"
        },
        from:{
            type:ObjectId,
            ref:"User"
        },
        content:String
    }],
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

CommentSchema.pre('save',function(next){
    var user = this;
    if(user.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next()
});

CommentSchema.statics = {
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

module.exports = CommentSchema;