var 		submit = 0;
function 	show_submitbar()
{
	$(".submit_bar").slideDown();
	submit = 1;
}

$(document).ready(function()
{
	$(".form_field, .form_title_field").click(function() {
		show_submitbar();
	});

	$(".address_edit").click(function()
	{
		$(".address_edit").not(this).each(function(){
			$(this).parent().parent().parent().find(".address_container").slideUp();
		});
		$(this).parent().parent().parent().find(".address_container").slideDown();
	});

	$("#form_profile").submit(function()
	{
		if (submit == 1)
			return true;
		else
			return false;
	});
});
