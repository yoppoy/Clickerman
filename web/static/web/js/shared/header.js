
$(document).ready(function(){
	$('.navbar-header').click(function(){
		$('.nav-header').toggleClass('visible');
		$('.nav-cover').toggleClass('cover-bg');
	});

	$('.nav-cover').click(function(){
		$('.nav-header').toggleClass('visible');
		$('.nav-cover').toggleClass('cover-bg');
	});

	$(window).resize(function(){
		if ($(window).width() > 640)
		{
			$('.nav-header').removeClass('visible');
			$('.nav-cover').removeClass('cover-bg');
		}
	});
});