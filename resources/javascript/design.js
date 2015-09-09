$(function(){
	var page=1;
	var i=6;
	var wrap=$(".work");
	var show=wrap.find(".work_list");
	var len=show.find("li").length;
	var pagecount=Math.ceil(len/i);
	var width=wrap.width();
	if(page==pagecount){
		$(".work .right").addClass("nodata");
	}
	if(page==1){
		$(".work .left").addClass("nodata");
	}
	$(".work .right").click(function(){
		if(!show.is(":animated")){
			if(page==pagecount){
				$(this).addClass("nodata");
			}else{
				show.animate({left:'-='+ width},"slow"); 
				page++;
				if(page==pagecount){
					$(this).addClass("nodata");
				}
				if(page!=1){
					$(".work .left").removeClass("nodata");
				}
			}
		}
	});
	$(".work .left").click(function(){
		if(!show.is(":animated")){
			if(page==1){
				$(this).addClass("nodata");
			}else{
				show.animate({left:'+='+ width},"slow");
				page--;
				if(page==1){
					$(this).addClass("nodata");
				}
				if(page!=pagecount){
					$(".work .right").removeClass("nodata");
				}
			}
		}
	});
	$(".edit_work_list li").hover(function(){
		if(!$(this).hasClass("addMore")){
			var id = $(this).attr("id");
			$(this).append("<a href='/design/delete/"+id+"'class='delete'><i></i></a>");
		}
	},function(){
		$(this).children(".delete").remove();
	});
	$(".edit_work_list li").click(function(){
		if(!$(this).hasClass("addMore")){
			$(this).remove();
		}else{
			$("body").append("<div class='overlay'></div>");
			$(".popup").show();
		}
	});
	$.imageFileVisible({wrapSelector: "#image-wrap",   
		fileSelector: "#file"
	});
})