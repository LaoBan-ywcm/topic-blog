/**
 * Created by hp-pc on 2017/6/16 0016.
 */
$(function(){
    var $change = $('#updatepassword');
    var content = '<div class="form-group"><label>旧密码</label><input class="form-control",type="password" name="user[oldpassword]"></div><div class="form-group"><label>新密码</label><input class="form-control",type="password" name="user[newpassword]"></div><button type="submit" class="btn">保存</button>'
    $change.on('click',function(){
        $change.next('p').remove();
        $change.closest('form').append(content)
        $change.parent().remove();
    });
});