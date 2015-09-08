$(function(){
	var page=1;
	var wrap=$(".work");
	var show=wrap.find(".work_list");
	var pagecount=show.length;
	var width=show.width();
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
				for(var j=0;j<page;j++){
					$(".work_list").eq(j).animate({left:'-='+width*(j+1)},"slow");
				}
				$(".work_list").eq(page).animate({left:0},"slow"); 
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
				for(var j=page;j>0;j--){
					$(".work_list").eq(j-1).animate({left:'+='+width*j},"slow");
				}
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
	$(".work_list li").click(function(){
		var imgsrc=$(this).find("img").attr("src");
		$("body").append("<div class='overlay'></div>");
		$(".popup .popupContent").empty().append("<img src='"+imgsrc+"'/>");
		$(".popup").show();
	})
})