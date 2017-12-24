/*
* @Author: yoppoy
* @Date:   2017-01-26 22:28:52
* @Last Modified 2017-02-01
* @Last Modified time: 2017-02-01 09:24:13
FILE FOR LOCAL GENERATION ON NUMBERS
*/

function 	generate_num(callback, event)
{
	var 	a;
	var 	random;

	a = Math.random();
	if (a < 0.1)
		random = Math.floor((Math.random() * 100000) + 0);
	else if (a < 0.2)
		random = Math.floor((Math.random() * 200000) + 0);
	else if (a < 0.3)
		random = Math.floor((Math.random() * 300000) + 0);
	else if (a < 0.4)
		random = Math.floor((Math.random() * 400000) + 0);
	else if (a < 0.5)
		random = Math.floor((Math.random() * 500000) + 0);
	else if (a < 0.6)
		random = Math.floor((Math.random() * 600000) + 0);
	else if (a < 0.7)
		random = Math.floor((Math.random() * 700000) + 0);
	else if (a < 0.9)
		random = Math.floor((Math.random() * 800000) + 0);
	else if (a < 0.95)
		random = Math.floor((Math.random() * 1000000) + 0);
	else
		random = Math.floor((Math.random() * 100000) + 0);
	callback(random, event);
}