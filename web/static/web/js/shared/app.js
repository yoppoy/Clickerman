function 	scrollTo(id)
{
	if ($(id).length != 0)
	{
		$('html, body').stop().animate({
			scrollTop: $(id).offset().top + 1
		}, 500, 'swing');
		return false;
	}
}

function 	fill_page() {
	var 	offset;

	$(".fill_page").each(function() {
		console.log("fill page");
		$(this).css("height", "auto");
		offset = $(this).offset();
		new_height = $(window).height() - (offset.top);
		if (new_height > $(this).height())
		{
			$(this).css("height", new_height);
		}
		if ($(this).height() > $(window).height() || $(this).width() < 343)
			$(this).css("height", "auto");
	});
}

function 	vertical_center(item)
 {
 	$(item).children().css({'padding-top':'0px'});
 	var y = $(item).height();
 	var x = $(item).children().first().css('height');
 	var padding = ((y - parseInt(x)) / 2);

 	$(item).children().css({"padding-top" : padding});
 }

$(window).resize(function() {
	fill_page();
	$(".center").each(function(){
 		vertical_center(this);
 	});
});

setTimeout(function(){
	$(".center").each(function(){
 		vertical_center(this);
 	});
}, 3000);

$(document).ready(function()
{
	fill_page();
	$(".center").each(function(){
 		vertical_center(this);
 	});
	$('a').click(function(){
		scrollTo($(this).attr('href'));
	});
});