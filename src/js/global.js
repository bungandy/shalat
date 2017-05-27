$(function(){
	var checkTable = setInterval(function(){
		if( $('.schedule .today').length ){
			var todayElem	= $('.schedule .today'),
				todayOffs	= (todayElem.outerHeight()*2)-2,
				todayPos 	= todayElem.offset().top - todayOffs;
			console.log('data loaded');
			clearInterval(checkTable);
			// console.log(todayPos);

			if(todayPos>($(window).height()*0.75)){
				$('body').animate({
					scrollTop: todayPos
				});
			}
		}else{
			console.log('waiting data..');
		}
	},100);
});