$(function(){


	$(window).load(function(){
		sizing();
	});


	$(window).resize(function(){
		sizing();
	});


	function sizing(){
		var   winWidth = $(window).width()
			 winHeight = $(window).height()
			  docWidth = $(document).width()
		     docHeight = $(document).height()
		  headerHeight = $('#header').outerHeight();


		if(winWidth > 767){
			$('#scheduleTable').css({
				marginTop: (headerHeight+15)+'px'
			});
		}else{
			$('#scheduleTable').css({
				marginTop: (139+15)+'px'
			});
		}

		console.log('window   : ' + winWidth + 'x'+ winHeight + '\n-------------------\ndocument : ' + docWidth + 'x' + docHeight);
	}
	

	
}); //End