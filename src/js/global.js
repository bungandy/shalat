$(function(){
	var check = setInterval(function(){
		
		if( $('.schedule .today').length ){
			var todayElem	= $('.schedule .today'),
				todayOffs	= todayElem.outerHeight()*2,
				todayPos 	= todayElem.offset().top - todayOffs;
			$('body').animate({
				scrollTop: todayPos
			});

			clearInterval(check);
		}else{
			console.log('waiting data..');
		}

	},400);
});