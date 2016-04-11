$(function(){
	var checkTable = setInterval(function(){
		if( $('.schedule .today').length ){
			var todayElem	= $('.schedule .today'),
				todayOffs	= (todayElem.outerHeight()*2)-2,
				todayPos 	= todayElem.offset().top - todayOffs;
			$('body').animate({
				scrollTop: todayPos
			});
			console.log('data loaded');
			clearInterval(checkTable);
		}else{
			console.log('waiting data..');
		}
	},1000);

	// var checkMeta = setInterval(function(){
	// 	if( $('#meta').val().length ){
	// 		$('meta[name="description"]').attr('content','Pray Times based on your current location. '+$('#meta').val());
	// 		console.log('has value');
	// 		clearInterval(checkMeta);
	// 	}else{
	// 		console.log('value null');
	// 	}
	// },100);
});