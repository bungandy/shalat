$(function(){
	var checkTable = setInterval(function(){
		if( $('.schedule .today').length ){
			var todayElem	= $('.schedule .today'),
				todayOffs	= (todayElem.outerHeight()*2)-2,
				todayPos 	= todayElem.offset().top - todayOffs;
			$('body').animate({
				scrollTop: todayPos
			});
			console.log('data loaded.');
			clearInterval(checkTable);
		}else{
			console.log('waiting data..');
		}
	},1000);
});