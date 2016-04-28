var is_loading = false;
var acces_token = '3263043.a125a4f.5144c77c9ccd41cc96c1a86da89be914';
var tag_next_id = undefined;
//1030323261 -- cipoys
//3263043 -- bungandy
var url_insta = 'https://api.instagram.com/v1/users/3263043/media/recent?access_token='+acces_token+'&count=12';
var is_loaded = false;
var video = null;


function load_instagram_wall(qty){
    $(".loading").show();

    var success = function(data){
        // console.log(data);

        var pagination = data.pagination;
        var data = data.data;
        if(pagination.next_url)
        {
            url_insta = pagination.next_url;
        }
        else
        {
            $('#load-more-ig').remove();
        }
        
        
        if(data.length > 0)
        {
            $.each( data, function( key, value ) {

                // console.log(data);
            
                var caption = "";
                var date = new Date(value.created_time*1000);
                var caption_text = "";

                if(value.caption != null)
                {
                    caption_text = value.caption.text;
                }
            
                if(value.type=='image')
                {
                    //photo
                    $('#ig_feed').append('<li><a href="javascript:void(0);" onclick="load_detail($(this))" data-img="'+value.images.standard_resolution.url+'" data-user="@'+value.user.username+'" data-date="'+date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()+'" data-title="'+caption_text+'" title="'+caption_text+'" data-toggle="modal" data-target="#modalPhoto"><img src="'+value.images.thumbnail.url+'" style="width:100%"/></a></li>');
                }
                else
                {   
                    //video
                    $('#ig_feed').append('<li class="video"><a href="javascript:void(0);" onclick="load_video($(this))" data-src-video="'+value.videos.standard_resolution.url+'" data-img="'+value.images.standard_resolution.url+'" data-user="@'+value.user.username+'" data-date="'+date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear()+'" data-title="'+caption_text+'" title="'+caption_text+'" data-toggle="modal" data-target="#modalVideo"><img src="'+value.images.thumbnail.url+'" style="width:100%"/></a></li>');
                }
        });
            
            if(pagination.next_max_tag_id)
            {
                tag_next_id = pagination.next_max_tag_id;
            }
            else
            {
                    tag_next_id = undefined;
            }
            
            
        }
           
        is_loading = false;
        $(".loading").hide();
        
    }

    
//freecollective
    if(is_loading == false)
    {
        is_loading = true;
        if(url_insta)
        {
            var options = {
                url:url_insta,
                dataType:'jsonp',
                type:'get',
                beforeSend:function(){},
                success:success
            }

            $.ajax(options);
        }
        
    }
    
}    

function load_detail(obj){
    $("#img_detail").attr('src','');
    $("#img_detail").attr('src',obj.attr('data-img'));
    $("#modalPhoto h4.title").html(obj.attr('data-title'));

}

function load_video(obj){
    video = null;// can't hurt
    delete(video);
    $("#modalVideo h4.title").html(obj.attr('data-title'));
    $('#videocontent').attr('poster',obj.attr('data-img'));
    $('#videocontent source').attr('src',obj.attr('data-src-video'));
    video = $("#videocontent").get(0);
    video.load();
    video.play();
}


$(document).ready(function(){
    load_instagram_wall(12);
    $('#modalVideo').on('hidden.bs.modal', function (e) {
      video.pause();
    })


    

});