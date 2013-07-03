
/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

 (function () {
    SweetSpot = {};


    var numtext = ["0", "1", "2", "3", "4", "5"];
    var firstPlayer = false;

    var Storage = function () {
      var obj = {};
      var localStorageIndex = 'sweetspot_game_data';

      var data = {
        'gametype': null,
        'player1Name': null,
        'player2Name': null,
        'player1Color': null,
        'player2Color': null
    };

    obj.save = function () {
        var str = JSON.stringify(data);
        localStorage.setItem(localStorageIndex, str);
    };

    obj.load = function () {
        var str = localStorage.getItem(localStorageIndex);
        if (str) {
          data = JSON.parse(str);
      }
  };

  var set = function (key, value) {
    data[key] = value;
};

obj.setGameType = function (type) {
    set('gametype', type);
};

obj.getGameType = function (type) {
    return data.gametype;
};

obj.setPlayer1Color = function (color) {
    set('player1Color', color);
};

obj.setPlayer2Color = function (color) {
    set('player2Color', color);
};

obj.getPlayer1Color = function () {
    return data.player1Color;
};

obj.getPlayer2Color = function () {
    return data.player2Color;
};

obj.setPlayer1Name = function (name) {
    set('player1Name', name);
};

obj.setPlayer2Name = function (name) {
    set('player2Name', name);
};

obj.getPlayer1Name = function () {
    return data.player1Name;
};

obj.getPlayer2Name = function () {
    return data.player2Name;
};

return obj;
};

var storage = Storage();
storage.load();

function GameData() {
    this.array = [[-1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1]];
    this.colindex = [0, 0, 0, 0, 0, 0, 0, 0];
}

function no_more_moves() {
    var array = SweetSpot.activegame.array;
    for(var i = 0; i < 7; i++)
        for(var j = 0; j < 6; j++)
            if(array[i][j] < 0)
                return false;
            return true;
        }

        function get_random_unfilled_column() {
            var array = SweetSpot.activegame.array;
            var colindex = SweetSpot.activegame.colindex;

            var columns = new Array();
            for(var i = 0; i < 7; i++)
                if(colindex[i] < 6)
                    columns.push(i);

                if(columns.length <= 0)
                    return -1;

                var tgt = (Math.random() * columns.length)|0;
                return columns[tgt];
            }

            function winning_move_possible(player) {
                var array = SweetSpot.activegame.array;
                var colindex = SweetSpot.activegame.colindex;
                var matches = 0;
                var column = -1;
                var i, j, k;

                /* vertical check */
                for(i = 0; i < 7; i++)
                {
                    matches = 0;
                    for(j = 0; j < colindex[i]; j++)
                        if(array[i][j] == player)
                            matches++;
                        else
                            matches = 0;
                        if(matches > 2)
                        {
                            console.log("POSSIBLE WIN: player "+player+" column "+(i+1));
                            return i;
                        }
                    }

                    /* horizontal check */
                    for(j = 0; j < 6; j++)
                    {
                        for(i = 0; i < 4; i++)
                        {
                            matches = 0;
                            column = -1;
                            for(k = 0; k < 4; k++)
                                if(array[i+k][j] == player)
                                {
                                    matches++;
                                }
                                else if((array[i+k][j] < 0)&&(colindex[i+k] == j)&&(column < 0))
                                {
                                    matches++;
                                    column = i+k;
                                }
                                else
                                {
                                    column = -1;
                                    matches = 0;
                                }
                                if((matches == 4)&&(column >= 0))
                                {
                                    console.log("POSSIBLE WIN: player "+player+" column "+(column+1));
                                    return column;
                                }
                            }
                        }

                        return -1;
                    }

                    function computermove() {
                        var col = -1;

                        /* if we can win, do it */
                        col = winning_move_possible(SweetSpot.activeplayer)
                        if(col >= 0)
                        {
                            startmove(col, true);
                            return;
                        }

                        /* if the opponent is about to win, block him */
                        col = winning_move_possible((SweetSpot.activeplayer+1)%2)
                        if(col >= 0)
                        {
                            startmove(col, true);
                            return;
                        }

                        /* do a random move */
                        col = get_random_unfilled_column();
                        if(col >= 0)
                        {
                            startmove(col, true);
                            return;
                        }
                    }

                    function gamesound(file) {
                      this.soundobj = new Audio(file);
                      this.isPlaying = false;
                      this.play = function () {
                        if (this.isPlaying) {
                          this.soundobj.pause();
                          this.soundobj.currentTime = 0;
                          this.isPlaying = false;
                      }

                      this.soundobj.play();
                      this.isPlaying = true;
                  };
              }

              function settype(type) {
                var tags = ["#type_onegame", "#type_bestofthree",
                "#type_bestoffive"];

                SweetSpot.gametype = type;
                storage.setGameType(type);

                for(var i = 0; i < 3; i++)
                {
                    if(type == i)
                        $(tags[i]).addClass("selectedtype");
                    else
                        $(tags[i]).removeClass("selectedtype");
                }

                test_type_ready();
            }

            function setcolor(player, tgt) {
        /*if(((player == 1)&&(SweetSpot.playercolor[1] == tgt))||
           ((player == 2)&&(SweetSpot.playercolor[0] == tgt)))
        {
            return;
        }*/

        var tags = ["#player_player"+player+"orange",
        "#player_player"+player+"red",
        "#player_player"+player+"blue",
        "#player_player"+player+"green"];
        var solid = ["orangesolid", "redsolid",
        "bluesolid", "greensolid"];

        if(player == 1)
        {
            SweetSpot.playercolor[0] = tgt;
            storage.setPlayer1Color(tgt);
        }
        else
        {
            SweetSpot.playercolor[1] = tgt;
            storage.setPlayer2Color(tgt);
        }

        for(var i = 0; i < 4; i++)
        {
            if(tgt == i)
            {
                $(tags[i]).addClass(solid[i]);
            }
            else
            {
                $(tags[i]).removeClass(solid[i]);
            }
        }

        test_player_ready();
    }

    function test_player_ready() {
        if((SweetSpot.player1name && (SweetSpot.player1name != ""))&&
         (SweetSpot.player2name && (SweetSpot.player2name != ""))&&
         ((SweetSpot.playercolor[0] >= 0) && (SweetSpot.playercolor[0] < 4))&&
         ((SweetSpot.playercolor[1] >= 0) && (SweetSpot.playercolor[1] < 4)))
        {
            $("#player_nextbutton").removeClass("inactive_button");
            $("#player_nextbutton").addClass("active_button");
        }
        else
        {
            $("#player_nextbutton").removeClass("active_button");
            $("#player_nextbutton").addClass("inactive_button");
        }
    }

    function test_type_ready() {
        /*if((SweetSpot.gametype >= 0) && (SweetSpot.gametype < 3))
        {
            $("#type_startbutton").removeClass("inactive_button");
            $("#type_startbutton").addClass("active_button");
        }
        else
        {
            $("#type_startbutton").removeClass("active_button");
            $("#type_startbutton").addClass("inactive_button");
        }*/
    }

    function init_game() {
      SweetSpot.player1name = storage.getPlayer1Name() || "Player1";
      SweetSpot.player2name = storage.getPlayer2Name() || "Player2";

      var player1Color = storage.getPlayer1Color() || 2;
      setcolor(1, player1Color);

      var player2Color = storage.getPlayer2Color() || 1;
      setcolor(2, player2Color);

      var gametype = storage.getGameType() || 0;
      settype(gametype);
  }

  function ignore_user_input() {
      SweetSpot.ignore_input = true;
  }

  function enable_user_input() {
      SweetSpot.ignore_input = false;
  }

  /* this represents a user making a move by clicking a column */
  function startmove(column, computer) {
    /* if we're in the middle of an animation, do nothing */
    if (SweetSpot.ignore_input&&(computer!==true)){
        log.info("ignore click active player is "  +  SweetSpot.activeplayer);
        return;
    }

    _startMove(column);
}

function _startMove(column){
    updateselector(column);
    navsnd();
    var row = SweetSpot.activegame.colindex[column];

    /* if this column is full, do nothing */
    if(row >= 6)
        return;

    /* set the board to indicate it's the next player's move */

    log.info("activePlayer is " + SweetSpot.activeplayer);
    if(SweetSpot.activeplayer == 0)
    {
        $("#game_player1active").hide();
        $("#game_player2active").show();

    }

    /* figure out what color piece we're using */
    var colorwheel = ["game_piece_orange", "game_piece_red",
    "game_piece_blue", "game_piece_green"];
    var piececolor = colorwheel[SweetSpot.playercolor[SweetSpot.activeplayer]];

    /* set the move data */
    SweetSpot.activegame.array[column][row] = SweetSpot.activeplayer;
    SweetSpot.activegame.colindex[column]++;

    /* trigger a call to test the board after the animation */

    SweetSpot.activeplayer = SweetSpot.activeplayer ==0 ? 1:0;
    log.info("activePlayer change to  " + SweetSpot.activeplayer);

    window.setTimeout("SweetSpot.movecomplete()", 600);

    /* start the move animation */
    $("#game_grid").append("<div id=\"game_column"+
     column+"_row"+row+"\" class=\"game_col"+
     column+" game_row"+row+" "+
     piececolor+"\"></div>");
}

    function _replayMove(column, colorIndex, replayActivePlayer){
/*        updateselector(column);
navsnd();*/
var row = SweetSpot.activegame.colindex[column];

/* if this column is full, do nothing */
if(row >= 6)
    return;

/* figure out what color piece we're using */
var colorwheel = ["game_piece_orange", "game_piece_red",
"game_piece_blue", "game_piece_green"];
var piececolor = colorwheel[colorIndex];

/* set the move data */
SweetSpot.activegame.array[column][row] = replayActivePlayer;
SweetSpot.activegame.colindex[column]++;

/* start the move animation */
$("#game_grid").append("<div id=\"game_column"+
 column+"_row"+row+"\" class=\"game_col"+
 column+" game_row"+row+" "+
 piececolor+"\"></div>");
}

function start_new() {
    $("#game_grid").empty();
    SweetSpot.activegame = new GameData();
    enable_user_input();
}

function game_over(player) {
    var color = SweetSpot.playercolor[player];
    var banner = ["win_banner_orange", "win_banner_red",
    "win_banner_blue", "win_banner_green"];
    var name = ["win_playername_orange", "win_playername_red",
    "win_playername_blue", "win_playername_green"];
    var playagain = ["win_playagain_orange", "win_playagain_red",
    "win_playagain_blue", "win_playagain_green"];
    var startover = ["win_startover_orange", "win_startover_red",
    "win_startover_blue", "win_startover_green"];

    if(player == 0) {
        $("#win_banner").html("Winner"); 
            $("#win_playername").text(SweetSpot.player1name);  
            $("#win_score").html( ((42 - shotCount) * 1234) + " points");

            $("#win_submit_score").show();

            $("#win_banner").css("line-height", "223px");
            $("#win_banner").css("top", "30px");
        } else {
            $("#win_banner").html("Try again"); 
            $("#win_banner").css("line-height", "198px");
            $("#win_banner").css("top", "150px");

            $("#win_submit_score").hide();

            $("#win_score").html("");
            $("#win_playername").text(SweetSpot.player2name);
        }

        for(var i = 0; i < 4; i++)
        {
            if(i == color)
            {
                $("#win_banner").addClass(banner[i]);
                $("#win_playername").addClass(name[i]);
                $("#win_playagain").addClass(playagain[i]);
                $("#win_startover").addClass(startover[i]);
            }
            else
            {
                $("#win_banner").removeClass(banner[i]);
                $("#win_playername").removeClass(name[i]);
                $("#win_playagain").removeClass(playagain[i]);
                $("#win_startover").removeClass(startover[i]);
            }
        }
        showScreen("win_page");

    }

    function create_game () {
        shotCount = 0;

        selectsnd();
        $("#quit_dlg").hide();
        $("#player_left_dlg").hide();
        $("#game_grid").empty();
        SweetSpot.activegame = new GameData();
        SweetSpot.activeplayer = 1;
        SweetSpot.playerwins = [0, 0];
        $("#game_player1_wins").text(numtext[0]);
        $("#game_player2_wins").text(numtext[0]);
        $("#game_player1active").show();
        $("#game_player2active").hide();
        updateselector(SweetSpot.activecolumn);
    }

    function restart_game() {
        create_game();

        showScreen("game_page");
    }

    function win(player, i1, j1, i2, j2, i3, j3, i4, j4) {
        SweetSpot.playerwins[player]++;
        winsnd();
        $("#game_column"+i1+"_row"+j1).addClass("game_piece_win1");
        $("#game_column"+i2+"_row"+j2).addClass("game_piece_win2");
        $("#game_column"+i3+"_row"+j3).addClass("game_piece_win3");
        $("#game_column"+i4+"_row"+j4).addClass("game_piece_win4");
        $("#game_player"+(player+1)+"_wins").text(numtext[SweetSpot.playerwins[player]]);
        if(SweetSpot.playerwins[player] >= SweetSpot.gametype+1)
        {
            window.setTimeout("SweetSpot.game_over("+player+")", 1000);
        }
        else
        {
            window.setTimeout("SweetSpot.start_new()", 1000);
        }
    }

    function movecomplete() {
        var array = SweetSpot.activegame.array;
        var colindex = SweetSpot.activegame.colindex;
        var matches = [0, 0];
        var i, j, k;

        movesnd();
        /* vertical check */
        for(i = 0; i < 7; i++)
        {
            matches[0] = 0;
            matches[1] = 0;
            for(j = 0; j < 6; j++)
                if(array[i][j] >= 0)
                {
                    var tgt = array[i][j];
                    matches[tgt]++;
                    matches[(tgt+1)%2] = 0;
                    if(matches[tgt] >= 4)
                    {
                        win(tgt, i, j-3, i, j-2, i, j-1, i, j);
                        return;
                    }
                }
                else
                {
                    matches[0] = 0;
                    matches[1] = 0;
                }
            }

            /* horizontal check */
            for(j = 0; j < 6; j++)
            {
                matches[0] = 0;
                matches[1] = 0;
                for(i = 0; i < 7; i++)
                    if(array[i][j] >= 0)
                    {
                        var tgt = array[i][j];
                        matches[tgt]++;
                        matches[(tgt+1)%2] = 0;
                        if(matches[tgt] >= 4)
                        {
                            win(tgt, i-3, j, i-2, j, i-1, j, i, j);
                            return;
                        }
                    }
                    else
                    {
                        matches[0] = 0;
                        matches[1] = 0;
                    }
                }

                /* diagonal right check */
                var p = [[0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 0]];
                for(k = 0; k < 6; k++)
                {
                    matches[0] = 0;
                    matches[1] = 0;
                    for(i = p[k][0], j = p[k][1]; (i < 7)&&(j < 6); i++, j++)
                        if(array[i][j] >= 0)
                        {
                            var tgt = array[i][j];
                            matches[tgt]++;
                            matches[(tgt+1)%2] = 0;
                            if(matches[tgt] >= 4)
                            {
                                win(tgt, i-3, j-3, i-2, j-2, i-1, j-1, i, j);
                                return;
                            }
                        }
                        else
                        {
                            matches[0] = 0;
                            matches[1] = 0;
                        }
                    }

                    /* diagonal left check */
                    p = [[3, 0], [4, 0], [5, 0], [6, 0], [6, 1], [6, 2]];
                    for(k = 0; k < 6; k++)
                    {
                        matches[0] = 0;
                        matches[1] = 0;
                        for(i = p[k][0], j = p[k][1]; (i >= 0)&&(j < 6); i--, j++)
                            if(array[i][j] >= 0)
                            {
                                var tgt = array[i][j];
                                matches[tgt]++;
                                matches[(tgt+1)%2] = 0;
                                if(matches[tgt] >= 4)
                                {
                                    win(tgt, i+3, j-3, i+2, j-2, i+1, j-1, i, j);
                                    return;
                                }
                            }
                            else
                            {
                                matches[0] = 0;
                                matches[1] = 0;
                            }
                        }



                        /* if there are no more valid moves, it's a stalemate */
                        if(no_more_moves())
                        {
                            start_new();
                        }

                        /* is it the computer's move? */
                        if(SweetSpot.computer&&(SweetSpot.activeplayer==1))
                        {
                            computermove();
                        }
                        else
                        {

                            updateselector(SweetSpot.activecolumn);
            /*if(SweetSpot.activeplayer == 0){      
                enable_user_input();
            }*/
        }
    }

    function updateselector(column) {
        if (SweetSpot.ignore_input) {
            return;
        }

        if(SweetSpot.activeplayer != 0){
            _updateSelector(column);
            return;
        }
        
        SweetSpot.activecolumn = column;
        _updateSelector(column);
   }


    function _updateSelector(column){
        var colorwheel = ["game_piece_orange", "game_piece_red",
        "game_piece_blue", "game_piece_green"];
        var piececolor = colorwheel[SweetSpot.playercolor[SweetSpot.activeplayer]];

        $("#game_column_selector").attr("class", "game_selcol"+column);
        $("#game_column_selector").show();
        $("#game_column_selector_candy").attr("class", "game_col"+column+" "+piececolor);
        $("#game_column_selector_candy").show();
    }

    function movesnd() {
        SweetSpot.move_sound.play();
    }

    function navsnd() {
        SweetSpot.menunav_sound.play();
    }

    function selectsnd() {
        SweetSpot.select_sound.play();
    }

    function winsnd() {
        SweetSpot.win_sound.play();
    }

    function player1namechange() {
        SweetSpot.player1name = $('#player1name').val();
        storage.setPlayer1Name(SweetSpot.player1name);
        storage.save();
        test_player_ready();
    }

    function player2namechange() {
        SweetSpot.player2name = $('#player2name').val();
        storage.setPlayer2Name(SweetSpot.player2name);
        storage.save();
        test_player_ready();
    }

    var translate = function () {
      $("#intro_playbutton").text(chrome.i18n.getMessage("play"));
      $("#player_player1_static").text(chrome.i18n.getMessage("player1"));
      $("#player_player2_static").text(chrome.i18n.getMessage("player2"));
      $("#player_text_chooseyour").text(chrome.i18n.getMessage("chooseyour"));
      $("#player_text_color").text(chrome.i18n.getMessage("color"));
      $("#player_nextbutton").text(chrome.i18n.getMessage("next"));
      $("#type_onegame_text").text(chrome.i18n.getMessage("1game"));
      $("#type_bestofthree_text").text(chrome.i18n.getMessage("2game"));
      $("#type_bestoffive_text").text(chrome.i18n.getMessage("3game"));
      $("#type_startbutton").text(chrome.i18n.getMessage("start"));
      $("#quit_dlg_img").text(chrome.i18n.getMessage("startoverquestion"));
      $("#quit_dlg_no").text(chrome.i18n.getMessage("no"));
      $("#quit_dlg_yes").text(chrome.i18n.getMessage("yes"));
      $("#win_banner").text(chrome.i18n.getMessage("winner"));
      $("#win_playagain_text").text(chrome.i18n.getMessage("playagain"));
      $("#win_startover_text").text(chrome.i18n.getMessage("startover"));
      numtext[0] = chrome.i18n.getMessage("num0");
      numtext[1] = chrome.i18n.getMessage("num1");
      numtext[2] = chrome.i18n.getMessage("num2");
      numtext[3] = chrome.i18n.getMessage("num3");
      numtext[4] = chrome.i18n.getMessage("num4");
      numtext[5] = chrome.i18n.getMessage("num5");
  };

    // initialise individual pages
    var introPage = function () {
      // animation for front page
      $('[data-drop]').each(function () {
        var drop = $(this).attr('data-drop');
        $(this).addClass('drop').addClass(drop);
    });
  };

  var playerPage = function () {
      $('#player1name').val(SweetSpot.player1name);
      $('#player2name').val(SweetSpot.player2name);

      $('#choose_color_page').delegate('.pick', 'mousedown', function (e) {
        var elt = $(e.target);

        navsnd();

        var player = parseInt(elt.attr('data-player'));
        var color = parseInt(elt.attr('data-color'));

        setcolor(player, color);

        if (color == 1) {
            setcolor(2, 2);
        } else {
            setcolor(2, 1);
        }

    });

      var p1name = document.getElementById("player1name");
      var p2name = document.getElementById("player2name");
      p1name.onkeyup = player1namechange;
      p2name.onkeyup = player2namechange;
      p1name.onblur = player1namechange;
      p2name.onblur = player2namechange;
      p1name.onchange = player1namechange;
      p2name.onchange = player2namechange;

      /*$("#player_nextbutton").click(function() {
          if($("#player_nextbutton").hasClass("active_button"))
          {
              selectsnd();
              showScreen("game_page");
          }
      });*/
};

var gameTypePage = function () {
    $("#type_startbutton").click(function() {

      if ($("#type_startbutton").hasClass("active_button")) {
        selectsnd();
        updateselector(SweetSpot.activecolumn);
        var color1class = ["game_player1orange", "game_player1red",
        "game_player1blue", "game_player1green"];
        var color2class = ["game_player2orange", "game_player2red",
        "game_player2blue", "game_player2green"];

        for(var i = 0; i < 4; i++) {
          var c1 = SweetSpot.playercolor[0];
          var c2 = SweetSpot.playercolor[1];
          if(i == c1)
              $("#game_player1marquee").addClass(color1class[i]);
          else
              $("#game_player1marquee").removeClass(color1class[i]);

          if(i == c2)
              $("#game_player2marquee").addClass(color2class[i]);
          else
              $("#game_player2marquee").removeClass(color2class[i]);
      }

      $("#game_player1name").text(SweetSpot.player1name);
      $("#game_player2name").text(SweetSpot.player2name);
      $("#type_page").hide();

	if (immediateJoin) {
	    nuggetaPlug.searchImmediateGame();
	    showScreen("searching_player_page");
	} else {
	    nuggetaPlug.joinGame(gameIdToJoin);
	}

$
}
});

$('#type_onegame').on('mousedown', function() {navsnd();settype(0);});
$('#type_bestofthree').on('mousedown', function() {navsnd();settype(1);});
$('#type_bestoffive').on('mousedown', function() {navsnd();settype(2);});
};

var gamePage = function () {
  $('#game_column1').on('mousedown', function() {startmove(0);});
  $('#game_column2').on('mousedown', function() {startmove(1);});
  $('#game_column3').on('mousedown', function() {startmove(2);});
  $('#game_column4').on('mousedown', function() {startmove(3);});
  $('#game_column5').on('mousedown', function() {startmove(4);});
  $('#game_column6').on('mousedown', function() {startmove(5);});
  $('#game_column7').on('mousedown', function() {startmove(6);});

  $('#game_column1').on('mouseover', function() {updateselector(0);});
  $('#game_column2').on('mouseover', function() {updateselector(1);});
  $('#game_column3').on('mouseover', function() {updateselector(2);});
  $('#game_column4').on('mouseover', function() {updateselector(3);});
  $('#game_column5').on('mouseover', function() {updateselector(4);});
  $('#game_column6').on('mouseover', function() {updateselector(5);});
  $('#game_column7').on('mouseover', function() {updateselector(6);});

  $('#game_quit').click(function() {$("#quit_dlg").show();});
  $('#quit_dlg_no').click(function() {$("#quit_dlg").hide();});
  $('#quit_dlg_yes').click(function() {
    endGame();
});
  $('#win_playagain_text').click(function() {
    showScreen("searching_player_page");
    playAgain();
});
  $('#win_startover_text').click(function() {
    endGame()
});

  $('#player_left_dlg_ok').click(function() {
    endGame();
});
};

    // load sounds
    SweetSpot.select_sound = new gamesound("audio/Select.ogg");
    SweetSpot.move_sound = new gamesound("audio/GamePiece.ogg");
    SweetSpot.menunav_sound = new gamesound("audio/MenuNavigation.ogg");
    SweetSpot.win_sound = new gamesound("audio/Winner.ogg");

    SweetSpot.player1name = "";
    SweetSpot.player2name = "";
    SweetSpot.computer = false;
    SweetSpot.playercolor = [-1, -1];
    SweetSpot.gametype = 0;
    SweetSpot.activegame = new GameData();
    SweetSpot.activecolumn = 0;
    SweetSpot.activeplayer = 1;
    SweetSpot.playerwins = [0, 0];
    SweetSpot.ignore_input = true;
    SweetSpot.movecomplete = movecomplete;
    SweetSpot.game_over = game_over;
    SweetSpot.start_new = start_new;

    if (window.chrome && window.chrome.i18n) {
      translate();
  }


  init_game();

  introPage();
  playerPage();
  gameTypePage();
  gamePage();

  storage.save();

/*
 * Nuggeta integration 
 */

var game = null;
var log = NLoggerFactory.getLogger("SweetSpot");

/*
 * Send functions
 */

/*
 * Nuggeta callbacks
 */

function onConnectionReady(message) {
    log.info("Connection ready");
    $("#intro_playbutton").text("Play");

    nuggetaPlug.getAchievementBoard();
}

function onConnectionFail(message) {
    log.info("Connection failed");
    $("#intro_playbutton").text("Failed");
}



function initFirstGame() {
    log.info("accepted Joined game " + game.getId());
    if (game.getPlayers().length== 1) {
        firstPlayer = true;
    } else {
        var myOponnent = game.getPlayers()[0];

        if (myOponnent.getThirdPartyId() != null) {
            SweetSpot.player2name = myOponnent.getName();
            $("#game_player2name").text(SweetSpot.player2name);
            $("#game_player2avatar").html('<img src="' + nuggetaPlug.getAvatar(myOponnent) + '"/>');
        } else {
            SweetSpot.player2name = "Player2";
            $("#game_player2name").text(SweetSpot.player2name);
            $("#game_player2avatar").html('');
        }
    }
}

function endGame() {
    create_game();

    if (loggedPlayer != null) {
        goToScreen("logged_menu");
    } else {
        goToScreen("menu_page");
    }

    nuggetaPlug.unjoinGame(game.getId());
}

function playAgain() {
    nuggetaPlug.unjoinGameRequest(game.getId(), function (response) {
        nuggetaPlug.searchImmediateGame();
    });
}

function invalidJoinGame() {
    log.error("No playable game found");
    alert('No game available found');

    if (loggedPlayer != null) {
        goToScreen("logged_menu");
    } else {
        goToScreen("menu_page");
    }
}

function onSearchImmediateGameResponse(message) {
    game = message.getGame();

    if(message.getSearchImmediateGameStatus() == SearchImmediateGameStatus.ACCEPTED){
        initFirstGame();
    } else {
        invalidJoinGame();
    }
}

function onPlayerEnterGame(message) {
    var myOponnent = message.getPlayer();

    if (myOponnent.getThirdPartyId() != null) {
        SweetSpot.player2name = myOponnent.getName();
        $("#game_player2name").text(SweetSpot.player2name);
        $("#game_player2avatar").html('<img src="' + nuggetaPlug.getAvatar(myOponnent) + '"/>');
    }
}

function onPlayerUnjoinGame(message) {
    log.info(message.getPlayer().getName() + " left game " + message.getGameId());
    $("#player_left_dlg").show();
}

function onJoinGameResponse(message) {
    game = message.getGame();

    if (message.getJoinGameStatus() == JoinGameStatus.ACCEPTED) {
        initFirstGame();
    } else {
        invalidJoinGame();
    }
}

function quit_game() {
	goToScreen("menu_page");
}



function onGameStateChange(message) {
    log.info("Game state changed");
    if(message.getGameRunningState() == GameRunningState.RUNNING){
        restart_game();

        nuggetaPlug.nextPlayerTurn(game.getId());
    }
}



function onMyTurnNotification(message) {
    enable_user_input();
    SweetSpot.activeplayer = 0;
    $("#game_player1active").show();
    $("#game_player2active").hide();
}

function onPlayerTurnNotification(message) {
    ignore_user_input();
    $("#game_player1active").hide();
    $("#game_player2active").show();
}



/*
 * UI events
 */

var screens = new Array();

function backToPreviousScreen() {
    if(screens.length  >1){
        $('#' + screens.pop()).hide();
        $('#' + screens[screens.length-1]).show();
    }
}

function goToScreen(screenId) {
    while (screens[screens.length-1] != screenId && screens.length > 0) {
        backToPreviousScreen();
    }
}

function showScreen(screenId) {
    $('#' + screens[screens.length-1]).hide();
    screens.push(screenId);
    $('#' + screenId).show();
}

$

$("#intro_playbutton").click(function() {
  selectsnd();

  showScreen("menu_page");


});

$("#visitor_log").click(function() {
    immediateJoin = true;

    showScreen("choose_color_page");
});

$("#cancel_searching_player").click(function () {
    nuggetaPlug.unjoinGameRequest(game.getId(), function () {
        quit_game();
    });
});



/*
 * Starting Nuggeta
 */

var shotCount = 0;



var pump = function pump(){
    messages = nuggetaPlug.pump();
    if(messages.length >0){
        for(var i = 0; i < messages.length; i++) {
            message = messages[i];
            log.info("received message "  + message.toString());

			if (message instanceof ConnectionReady) {
			    onConnectionReady(message);
			} else if (message instanceof ConnectionFail) {
			    onConnectionFail(message);
			}

			else if(message instanceof SearchImmediateGameResponse){
			    onSearchImmediateGameResponse(message);
			}else if(message instanceof PlayerEnterGame){
			    onPlayerEnterGame(message);
			}else if(message instanceof PlayerUnjoinGame){
			    onPlayerUnjoinGame(message);
			}else if( message instanceof GameStateChange){
			    onGameStateChange(message);
			}else if(message instanceof JoinGameResponse) {
			    onJoinGameResponse(message);
			}

			else if(message instanceof MyTurnNotification){
			    onMyTurnNotification(message);
			}else if( message instanceof GameStateChange){
			    onGameStateChange(message);
			}else if(message instanceof PlayerTurnNotification){
			    onPlayerTurnNotification(message);
			}

            else {
                log.info("no handled message " + message.toString());
            }

        }

    }
};

setInterval(pump,20);

var nuggetaPlug = new NuggetaPlug().init("nuggeta://sweetspot_1d51f7cc-91b7-45ee-8b2d-c0ad638b7432-1");
nuggetaPlug.start();

})()
