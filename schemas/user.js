/**
 * Created by hp-pc on 2017/6/15 0015.
 */
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    password:String,
    email:String,
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

UserSchema.pre('save',function(next){
    var user = this;
    if(user.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }

    next()
});

UserSchema.statics = {
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

module.exports = UserSchema;