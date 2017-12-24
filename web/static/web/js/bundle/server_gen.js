/*
* @Author: yoppoy
* @Date:   2017-01-31 16:01:55
* @Last Modified 2017-02-17
* @Last Modified time: 2017-02-17 12:54:13
FILE FOR SERVER BASED GENERATION ON NUMBERS
*/

var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('post', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

window.setInterval(function(){
  call_leaderboard();
}, 500);

function  update_leaderboard(data)
{
  var     a;
  
  $("#dropdown_leaderboard > .dropdown_container > p").remove();
  for(var k in data) {
    a = parseInt(k) + 1;
    $("#dropdown_leaderboard > .dropdown_container").append('<p class="large-text-right small-text-left text-condensed show-score">' + a + '. ' + data[k].score + '- <span class="bold">' + data[k].name + '</span></p>');
  }
  $("#dropdown_leaderboard > .dropdown_container > a").first().appendTo($("#dropdown_leaderboard > .dropdown_container"));
}

function  call_leaderboard()
{
  var     JData;

  getJSON(window.location.origin + '/api' + window.location.pathname + '/leaderboard').then(function(data) {
        JData = JSON.parse(JSON.stringify(data));
        if (!JData.hasOwnProperty('error'))
          update_leaderboard(data);
        else
          alert("Erreur : " + JData.error);
  }, function(status) { //error detection....
        alert('Un problème est survenu');
  });
}

function  update_score(new_highscore)
{
  var     old_highscore;

  old_highscore = parseInt($('#player_score').html());
  if (old_highscore != new_highscore) { 
    $('#player_score').html(new_highscore);
    if (old_highscore > new_highscore)  
      shine_text("decrease");
    else
      shine_text("increase");
  }
}

function  display_num(random_num, new_highscore, event)
{
  var   score;
  var   mouse;

  mouse = get_mouse_positon(event);
  score = format_number(random_num);
  create_text(score, mouse.X, mouse.Y);
  clearTimeout(timer);
  $(animation_scale).css({"-webkit-animation-play-state" : "paused", "animation-play-state" : "paused"});
  timer = setTimeout(function() {
    $(animation_scale).css({"-webkit-animation-play-state" : "running", "animation-play-state" : "runnning"});
  }, 250);
  clear_queue();
  update_score(new_highscore);
}

function  update_remaining_clicks(data)
{
  var     count;
  var     last_clicks;

  count = 1;
  last_clicks = JSON.parse(data.last_clicks);
  while (count <= 10)
  {
    $("#dropdown_clicks > .dropdown_container > p:nth-child(" + count + ")").html(last_clicks[count - 1]);
    count++;
  }
}

function  update_info(data)
{
  if (data != 'undefined')
  {
    $("#player_rank").html(data.position);
    $("#player_remaining_clicks").html(data.remaining_clicks);
    $("#player_clicks").html(data.nb_clicks);
    update_remaining_clicks(data);
 }
}

function  generate_num(callback, event)
{
  var   random;
  var   JData;

  generate_status = false;
  getJSON(window.location.origin + '/api' + window.location.pathname + '/click').then(function(data) {
        JData = JSON.parse(JSON.stringify(data));
        if (!JData.hasOwnProperty('error'))
        {
          callback(JData.score, JData.highscore, event);
          update_info(JData);
          generate_status = true;
        }
        else if (data.error == "no_last_clicks")
          show_no_clicks();
        else
          alert("Erreur : " + JData.error);
  }, function(status) { //error detection....
        alert('Un problème est survenu');
  });
}

//HERE TO MANAGE THE APPEARANCE OF THE OUT OF CLICKS MODAL ON THE LOADING OF THE PAGE
function  show_no_clicks()
{
  generate_status = true;
  window.location.replace(window.location.origin + window.location.pathname + "#out_of_clicks");
}

check_modal_condition();
function  check_modal_condition()
{
  if (window.location.href.endsWith("#out_of_clicks") && $("#player_remaining_clicks").html() != "0")
    window.location.replace(window.location.origin + window.location.pathname);
   if (window.location.href.endsWith("#out_of_clicks") == false && $("#player_remaining_clicks").html() == "0")
    window.location.replace(window.location.origin + window.location.pathname + "#out_of_clicks");
}