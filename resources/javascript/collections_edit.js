$(function(){
	$(".first p").removeClass("bottom").addClass("top");
	$(".first ul.second").show();
	$(".container").css("padding-bottom","0px");
	// $(".col li").click(function(){
	// 	location.href="/collections_product";
	// })
	$(".product_list li").eq(0).addClass("checked");
	var indeximgsrc=$(".product_list li").eq(0).find("img").attr("src");
	$(".product .img").find("img").attr("src",indeximgsrc);
	$(".product_list li").click(function(){
		var imgsrc=$(this).find("img").attr("src");
		$(this).addClass("checked").siblings().removeClass("checked");
		$(".product .img").find("img").attr("src",imgsrc);
	});
	
	$(".first ul.second li").click(function(){
		var index=$(this).index();
		$(".col").eq(index).show().siblings().hide();
		$(this).addClass("index").siblings().removeClass("index");
	});
	$(".first ul.second li").each(function(){
		if($(this).hasClass("index")) {
			var index=$(this).index();
			$(".col").eq(index).show().siblings().hide();
		}
	});
	$(".editProductlists li").hover(function(){
		if($(this).parent().children().length>2){
			if(!$(this).hasClass("addMore")){
				var id = $(this).attr("id");
				var url = $(this).attr("name");
				$(this).append("<a href='/collections_product/delete/"+id+"/"+url+"'class='delete'><i></i></a>");
			}
		}
	},function(){
		$(this).children(".delete").remove();
	})
	$(".editProductlists .addMore").click(function(){
		$("body").append("<div class='overlay'></div>");
		$(".popup").show();
	});
	$.imageFileVisible({wrapSelector: "#image-wrap",   
		fileSelector: "#file"
	});
	
})