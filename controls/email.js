/**
 * Created by hp-pc on 2017/6/16 0016.
 */
var nodemailer = require('nodemailer');

var transposter = nodemailer.createTransport({
    service: 'qq',
    port: 465,
    secureConnection:true,
    auth:{
        user:'2459007415@qq.com',
        pass:'iqkoyegrqofodhhe'
    }
});


module.exports = transposter;

