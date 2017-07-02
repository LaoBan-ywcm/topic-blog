/**
 * Created by hp-pc on 2017/6/16 0016.
 */
$(function(){

    //更新密码

    var $change = $('#updatepassword');
    var content = '<div class="form-group"><label>旧密码</label><input class="form-control",type="password" name="user[oldpassword]"></div><div class="form-group"><label>新密码</label><input class="form-control",type="password" name="user[newpassword]"></div><button type="submit" class="btn">保存</button>'
    $change.on('click',function(){
        $change.next('p').remove();
        $change.closest('form').append(content)
        $change.parent().remove();
    });



    //删除文章
    var $button = $('.del');
    $button.on('click',function(e){
        var $target = $(e.target);
        var id = $target.data('id');
        var $div = $('.item-id-' + id);

        $.ajax({
            type:'DELETE',
            url:'/user/delete/article?id=' + id
        }).done(function(results){
            if(results.success == 1){
                if($div.length > 0){
                    $div.remove();
                }
            }
        })
    });
});