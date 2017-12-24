function 	square_aspect(img)
{
	var 	width;
	var 	height;
	var 	padding;

	width = $(img).width();
	height = $(img).height();
	padding = (((width - height) / width) * 50) + "%";
	$(img).css({"padding-top" : padding, "padding-bottom" : padding});
}

function 	format_number(num)
{
	var 	convert;
	var 	count;
	var 	check;

	if (isNaN(num))
		return (num);
	back = num.toString();
	count = back.length;
	check = 0;
	while (count != 0)
	{
		if (check == 3)
		{
			back = back.substring(0, count) + ',' + back.substring(count, back.length);
			check = 0;
		}
		check++;
		count--;
	}
	return (back)
}

/* ----------------------------------------------------------
FUNCTION TO MANAGE RANDOM PRINT AND SCALE ANIMATION OF CIRCLE
-----------------------------------------------------------*/
var 	animation_scale;
var 	generate_status
var 	timer;
var 	cur_score = 0;


function 	update_score(random_num, score)
{
	if (isNaN(random_num) == false && random_num > cur_score) {	
		$('#player_score').html(score);
		shine_text("increase");
		cur_score = random_num;
	}
}

function 	display_num(random_num, event)
{
	var 	score;
	var 	mouse;

	mouse = get_mouse_positon(event);
	score = format_number(random_num);
	create_text(score, mouse.X, mouse.Y);
	clearTimeout(timer);
	$(animation_scale).css({"-webkit-animation-play-state" : "paused", "animation-play-state" : "paused"});
	timer = setTimeout(function() {
		$(animation_scale).css({"-webkit-animation-play-state" : "running", "animation-play-state" : "runnning"});
	}, 250);
	clear_queue();
	update_score(random_num, score);
}

animation_scale = document.getElementById("circle-border");
generate_status = true;
$("#circle-border").on("mousedown", function(event)
{
	if (generate_status == true)
		generate_num(display_num, event);
});

function 	get_mouse_positon(evt)
{
	var 	mouse;

	if (evt.pageX) {
		mouse = {
			X: evt.pageX,
			Y: evt.pageY
		};
	}
	else if (evt.clientX) {
		mouse = {
			X: evt.clientX + ((document.documentElement.scrollLeft) ? document.documentElement.scrollLeft : document.body.scrollLeft),
			Y: evt.clientY + ((document.documentElement.scrollTop) ? document.documentElement.scrollTop : document.body.scrollTop)
		};
	}
	return 	(mouse);
}

/* -----------------------------
FUNCTIONS TO PRINT GENERATED NUMBER
------------------------------*/
function 	shine_text(name)
{
	var 	element = document.getElementById("player_score");

	console.log(name);
	$('#player_score').removeClass("increase");
	$('#player_score').removeClass("decrease");
	void element.offsetWidth;
	$('#player_score').addClass(name);
}

function create_text(text, mouseX, mouseY)
{
	var 	leftPos;
	var 	rightPos;

	leftPos = mouseX + 'px';
	topPos = mouseY - 120 + 'px';
	$("<p class='text_dissapear' style='left:" + leftPos + "; top:" + topPos + "'>" + text + "</p>").appendTo($("#text-container"));
}

function 	clear_queue()
{
	var 	data_array;
	var		count;

	$('.text_dissapear').each(function()
	{
		if ($(this).css("opacity") <= 0.1)
			$(this).remove();
		count = count - 1;
	});
}

setTimeout(function(){
	square_aspect("#circle-btn");
}, 500);

$(window).resize(function(){
	square_aspect("#circle-btn");
});

$(document).ready(function(){
	square_aspect("#circle-btn");
});