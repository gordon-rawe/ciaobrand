$(function(){
	var flag=0;
	$(".navigation .first p").click(function(){
		if(flag==0){
			$(this).siblings(".second").show();
			$(this).removeClass("bottom").addClass("top");
			$(".container").css("padding-bottom","0px");
			flag=1;
		}else{
			$(this).siblings(".second").hide();
			$(this).removeClass("top").addClass("bottom");
			$(".container").css("padding-bottom","100px");
			flag=0;
		}
	});
	$(".popup .close").click(function(){
		$(this).parent().hide();
		$(".overlay").hide();
	})
})