/**
 * Created by hp-pc on 2017/6/20 0020.
 */
$(function(){
    //回复按钮
    $target = '';
    //回复按钮所在的media
    $media = '';
    //判断评论要加载哪个位置
    firstAdd = true;

    //对文章进行评论
    $('body').on('click','#commsubmit',function(){
        $.ajax({
            type:'POST',
            url:'/user/comment',
            data:{
                article:$('#aId').val(),
                content:$('#con').val()
            },
            success:function(res){
                addComment(res);
            }
        })
    });

    // 评论
    $('body').on('click','.reply',function(e){

        //点击回复按钮，添加元素
        //回复按钮
        $target = $(e.target);
        //回复按钮所在的media
        $media = $target.closest('.media');
        var from = $media.find('.from').val();
        var cId = $media.find('.cId').val();

        //评论别人
        if(!cId){
            cId = $target.closest('.main-media').find('.cId').val();
            from = $target.data('fid') || $target.closest('.main-media').find('.from').val();;
        }


        var html = `<div id="addreply"><textarea class="form-control replyContent" rows="2"></textarea><a class="btn btn-default replyToSome" data-cid="${cId}" data-uid="${from}">评论</a></div>`;
        $media.append(html);
        $target.css('display','none');

    });


    //点击评论按钮，提交数据

    $('body').on('click','.replyToSome',function(e){
        $target.css('display','inline-block');
        var $targetTo = $(e.target);
        var content = $media.find('.replyContent').val();
        var cId = $targetTo.data('cid');
        var to = $targetTo.data('uid');




        var $parent = $targetTo.closest('.main-media').find('.media-body').first();



        $.ajax({
            type:'POST',
            url:'/user/comment',
            data:{
                cId:cId,
                reply:{
                    to:to,
                    content:content
                }
            }
        }).done(function(res){
            addReply($parent,res);
        })
    })

});

function addComment(res){
    $('#con').val('');
    var html = '';
    html = `<hr><div class="media main-media"><input class="cId" type="hidden" value="${res.data._id}"><input class="from" type="hidden" value="${res.data.from._id}"><div class="media-left"><a href="#"><img src="http://iph.href.lu/50x62"></a></div><div class="media-body"><h4>${res.data.from.name}</h4><p>${res.data.content}<a class="reply">回复</a></a></p></div></div>`;

    $('.comment').append(html);
}


function addReply(parent,res){
    $('#addreply').remove();
    var html = '';
    html = `<hr><div class="media "><div class="media-left"><a href="#"><img src="http://iph.href.lu/50x62"></a></div><div class="media-body"><h4>${res.data.from.name}:@${res.data.to.name}</h4><p>${res.data.content}<a class="reply" data-tId="${res.data.to._id}">回复</a></a></p></div></div>`;
    parent.append(html);
}