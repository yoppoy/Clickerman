window.onload = function ()
{
	/*----------------------------------------------
	FUNCTIONS TO MANAGE ALL THE PROPERTY INITIATIONS
	----------------------------------------------*/
	var 		user;
	var			clock;
	var 		clock_timeinterval;
	var 		clock_deadline

	clock = document.getElementById('count_down');
	timeinterval = setInterval(updateClock,1000);
	clock_deadline = "December 7 2017 23:59:59 GMT+0200";
	//clock_deadline = $("end_date").html();
	init_color();
	init_clock(clock_deadline);
	updateClock();
	format_images()

	//TOUS LES INFOS SUR LE PRODUIT VIENNENT ICI DONC METS TON AJAX POUR CHAQUE VARIABLE

	function 	init_color()
	{
		var  	ua;
		var  	msie;
		var 	color_light;
		var 	color_medium;
		var 	color_rest;
		
		color_light = '#02a1ff';
		color_medium = '#0198f1';
		color_rest = 'white'//'yellow !important';
		ua = window.navigator.userAgent;
		msie = ua.indexOf("MSIE ");
		set_color_ie(color_light, color_medium, color_rest);
	}

	/*------------------------------
	FUNCTION TO APPLY TEXT ON WINDOW
	------------------------------*/
	function 	format_images()
	{
		var 	f_image;
		var 	f_image_remodal;
		var 	f_logo;

		$("#f_image").ondragstart = function() { return false; };
		$("#f_image_remodal").ondragstart = function() { return false; };
		$("#circle-btn").ondragstart = function() { return false; };
	}

	/*-------------
	FORMAT FUNCTION
	-------------*/
	function 	format_price(value, currency)
	{
		var 	back;
		var 	count;

		count = 0;
		while (value[count] != '.' && value[count] != ',' )
			count++;
		back = '<span style="font-weight:300">Valeur</span> ' + value.substring(0, count) + currency + '<span style="position: relative; bottom: 1ex; font-size: 70%;">' + value.substring(count + 1, value.length) + '</span>';
		return (back);
	}

	/*----
	COLORS
	----*/

	function 	set_color(color_light, color_medium, color_rest)
	{
		document.documentElement.style.setProperty('--c-light', color_light);
		document.documentElement.style.setProperty('--c-medium', color_medium);
		document.documentElement.style.setProperty('--c-rest', color_rest);
	}

	function 	set_color_loop(color, property, property_name)
	{
		var 	selector;
		var 	count;

		selector = document.querySelectorAll(property_name);
		count = 0;
		console.log("Setting color : " + color + " on property " + property + " on " + property_name);
		while (count < selector.length)
		{
			selector[count].style.setProperty(property, color, 'important');
			count++;
		}
	}	

	function 	set_color_ie(color_light, color_medium, color_rest)
	{
		var 	property = [".color-light", ".background-light", ".border-light", ".color-medium", ".background-medium",  ".border-medium", ".color-rest",  ".background-rest",  ".border-rest"];
		var 	property_name = ["color", "background", "border"];
		var 	color = [color_light, color_medium, color_rest];
		var 	color;
		var 	count;

		count = 0;
		while (count < property.length)
		{

			set_color_loop(color[Math.floor(count / 3)], property_name[count % 3], property[count]);
			count++;
		}
	}

	/*-------------------------------
	FUNCTIONS TO DISPLAY RANKED USERS
	-------------------------------*/
	
	var 		profiles_loaded;

	profiles_loaded = 10;
	document.getElementById("load_users").addEventListener("mousedown", function()
	{
		var 	count;
		var 	user;

		count = 0;
		user = [20];
		$('#load').css({"display" : "block"});
		while (count < 20)
		{
			user[count] = get_user(count + profiles_loaded);
			count++;
		}
		count = 0;
		$('#load').css({"display" : "none"});
		while (count < 20)
		{
			add_user(user[count]);
			count++;
		}
		$('#load').appendTo('#score_modal');
		$('#load_users').appendTo('#score_modal');
		profiles_loaded += 20;
	});

	function 	get_user(ranking)
	{
		var 	user; /*<----AJAX*/

		user = {};
		user.level = "1";
		user.pseudo = "User56789";
		user.image_adress = "NOT YET SUPPORTED";
		user.score = "500,400";
		return user;
	}

	function 	add_user(user)
	{
		var		html_code;

		html_code = '<div style="margin-bottom: 30px; class="profile_div"><div class="row"><div class="small-2 medium-2 columns" style="vertical-align: middle; height: 70px;" data-equalizer-watch><p class="text-condensed text-center round" style="color: white; vertical-align: middle; font-size: 90%;">' + user.level + '</p></div><div class="small-3 medium-2 columns" ><img src="img/profile-icon.png" style="max-height: 70px;" ></div><div class="small-7 medium-8 columns end" style="display: inline; height: 70px;"><div class="row"><div class="small-12 medium-6 columns"><p class="text-condensed text-left" style="line-height: 28px;">' + user.pseudo + '<br><span class="text-condensed-l">level : </span><span class="text-condensed-b">2</span></p></div><div class="show-for-medium medium-6 columns end"><p class="text-condensed-b text-center" style="line-height: 65px; font-size:40px; border-left: 2px solid var(--c-light)">' + user.score + '</p></div></div></div></div><div class="row show-for-small-only" style="margin-bottom: 30px;"><div class=" small-offset-5 small-7 medium-offset-3 medium-9 columns end"><p class="text-condensed-b text-left" style="line-height: 28px; font-size:40px;">500,000</p></div></div></div>';
		$('#score_modal').append(html_code);
	}

	document.getElementById("remodal-close-score").addEventListener("mousedown", function()
	{
		var 	profile;
		var 	viewport;

		viewport = document.getElementById("score_modal");
		profile = document.querySelectorAll("profile_div");
		count = profile.length - 1;
		while (profiles_loaded > 10)
		{
			viewport.removeChild(profile[count]);
			console.log("removed one");
			count--;
			profiles_loaded--;
		}
	});

	/* -----------------------------
	FUNCTION TO MANAGE SCORE DISPLAY
	------------------------------*/
	$('.dropdown > .dropdown_title').data("turn", 0);
	$('#dropdown_clicks > .dropdown_title').data("turn", 1);
	$('.dropdown > .dropdown_title').click(function() {
		$(this).siblings().stop().slideToggle();
		if ($(this).data("turn") == 1)
		{
			$(this).find(".fa").stop().css({"transform": "rotate(0deg)", "-webkit-transition-duration" : "0.3s"});
			show_score = false;
			$(this).data("turn", 0);
		}
		else
		{
			$(this).find(".fa").stop().css({"transform": "rotate(90deg)"});
			$(this).data("turn", 1);
		}
	});

	/* ----------------------------
	FUNCTION TO MANAGE SHARE BUTTON
	-----------------------------*/
	/*var 	show_share;

	show_share = false;
	document.getElementById("share").addEventListener("mousedown", function()
	{
		var		count;
		var		icons;
		var		info;

		if (show_share == false)
			show_share = true;
		else
			show_share = false;
		count = 0;
		info = document.getElementById("info-container");
		icons = document.querySelectorAll("show-icon");	
		while (count < icons.length)
		{
			if (show_share == true)
			{
				$(icons[count]).css({"opacity" : "1", "animation" : "button_appear 0.6s ease-out", "animation-direction": "normal"});
				$(info).css({"margin-bottom" : "60px"});
			}
			else
			{
				$(icons[count]).css({"opacity" : "0", "animation" : "button_dissappear 0.7s ease-in"});
				$(info).css({"margin-bottom" : "0px"});
			}
			count++;
		}
		var icon = document.getElementById("share");
		if (show_share == true)
			$(icon).css({"transform": "rotate(180deg) scale(1)", "-webkit-transition-duration" : "0.3s"});
		else
			$(icon).css({"transform": "rotate(0deg) scale(1.25)"});
	});
	*/
	/* --------------------
	FUNCTIONS FOR COUNTDOWN
	---------------------*/
	console.log("convert->" + convert_date("10 décembre 2016 00:00"));
	function 	convert_date(date)
	{
		var 	temp;

		//"December 7 2017 23:59:59 GMT+0200"
		temp = date.split(" ");
		return (temp[1] + " " + temp[0] + " " + temp[2] + " " + temp[3] + ":00 GMT+0200");
	}

	function 	init_clock(endtime){
		var 	timeinterval;

		timeinterval = setInterval(function(){
			var t = get_time(endtime);
			$('#count_down').html(t.days + 'j  ' + '&nbsp;' + t.hours + ' : ' + t.minutes + ' : ' + t.seconds);
			if(t.total <= 0){
				clearInterval(timeinterval);
			}
		},1000);
	}

	function 	updateClock(){
		var 	t;

		t = get_time(clock_deadline);
		$('#count_down').html(t.days + 'j   ' +  t.hours + ' : ' + t.minutes + ' : ' + t.seconds);
		if(t.total <= 0){
			clearInterval(timeinterval);
		}
	}

	function 	adapt_time(num)
	{
		if (num < 10)
			return ('0' + num); 
		return num;
	}

	function 	get_time(endtime)
	{
		var		t;
		var		seconds;
		var		minutes;
		var		hours;
		var		days;

		t = Date.parse(endtime) - Date.parse(new Date());
		seconds = adapt_time(Math.floor( (t/1000) % 60));
		minutes = adapt_time(Math.floor( (t/1000/60) % 60));
		hours = adapt_time(Math.floor( (t/(1000*60*60)) % 24));
		days = Math.floor( t/(1000*60*60*24));
		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}
}

	/* ----------------------------
	FUNCTION TO MANAGE SHARE BUTTON
	-----------------------------*/
	/*var 	show_share;

	show_share = false;
	document.getElementById("share").addEventListener("mousedown", function()
	{
		var		count;
		var		icons;
		var		info;

		if (show_share == false)
			show_share = true;
		else
			show_share = false;
		count = 0;
		info = document.getElementById("info-container");
		icons = document.querySelectorAll("show-icon");	
		while (count < icons.length)
		{
			if (show_share == true)
			{
				$(icons[count]).css({"opacity" : "1", "animation" : "button_appear 0.6s ease-out", "animation-direction": "normal"});
				$(info).css({"margin-bottom" : "60px"});
			}
			else
			{
				$(icons[count]).css({"opacity" : "0", "animation" : "button_dissappear 0.7s ease-in"});
				$(info).css({"margin-bottom" : "0px"});
			}
			count++;
		}
		var icon = document.getElementById("share");
		if (show_share == true)
			$(icon).css({"transform": "rotate(180deg) scale(1)", "-webkit-transition-duration" : "0.3s"});
		else
			$(icon).css({"transform": "rotate(0deg) scale(1.25)"});
	});*/