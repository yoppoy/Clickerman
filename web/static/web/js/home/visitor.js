/*
* @Author: yoppoy
* @Date:   2017-01-26 23:06:16
* @Last Modified 2017-01-26our Name>
* @Last Modified time: 2017-01-26 23:06:25
*/

function create_text(text, mouseX, mouseY)
{
	var 	leftPos;
	var 	rightPos;

	leftPos = mouseX + 'px';
	topPos = mouseY - 140 + 'px';
	$("<p class='text_dissapear' style='left:" + leftPos + "; top:" + topPos + "'>" + text + "</p>").appendTo($("#text-container"));
}