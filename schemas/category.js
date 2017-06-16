/**
 * Created by hp-pc on 2017/6/16 0016.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var CategorySchema = new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    articles:[
        {
            type:ObjectId,
            ref:'Article'
        }
    ],
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

CategorySchema.pre('save',function(next){
    var user = this;
    if(user.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next()
});

CategorySchema.statics = {
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

module.exports = CategorySchema;