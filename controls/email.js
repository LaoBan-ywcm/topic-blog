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

// options = {
//     from:'2459007415@qq.com',
//     to:'2459007415@qq.com',
//     subject:'博客验证码',
//     text:'Hello 邱齐'
//
// };

// transposter.sendMail(options,function(err,info){
//     if(err){
//         return console.log(err);
//     }
//     console.log('Message sent: ' + info.response);
// });

module.exports = transposter;

