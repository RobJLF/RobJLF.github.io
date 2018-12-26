function Local() {
  var game;
  var startx;
  var starty;
  var endx;
  var endy;
  var hasInitEvnet = false;
  // 初始化事件
  var initEvent = function () {
    $("#button-newGame").click(function () {
      start();
    });
    $(window).resize(function (event) {
      game.windowResize();
    });
    document.addEventListener("touchstart", function (event) {
      startx = event.touches[0].pageX;
      starty = event.touches[0].pageY;
    });
    document.addEventListener("touchmove", function (event) {
      event.preventDefault();
    });
    document.addEventListener("touchend", function (event) {
      endx = event.changedTouches[0].pageX;
      endy = event.changedTouches[0].pageY;

      var deltax = endx - startx;
      var deltay = endy - starty;

      if (deltax * deltax + deltay * deltay < 0.01 * game.windowWidth() * game.windowWidth()) {
        return;
      }
      // x
      if(Math.abs(deltax) >= Math.abs(deltay)) {
        if(deltax > 0) {//right
          if (game.getIsMovingAnimate()) return;
          if (game.moveLeft(180)) {
            game.newView();
          }
        }else {//left
          if (game.getIsMovingAnimate()) return;
          if (game.moveLeft(0)) {
            game.newView();
          }
        }
      //y
      }else {
        if(deltay > 0) {//down
          if (game.getIsMovingAnimate()) return;
          if (game.moveLeft(270)) {
            game.newView();
          }
        }else {//up
          if (game.getIsMovingAnimate()) return;
          if (game.moveLeft(90)) {
            game.newView();
          }
        }
      }
    });
    $(document).keydown(function (event) {
      switch (event.which) {
        case 37: //left
          if (game.getIsMovingAnimate()) return;
          if(game.moveLeft(0)) {
            game.newView();
          }
          break;
        case 38: //up
          event.preventDefault();
          if (game.getIsMovingAnimate()) return;
          if (game.moveLeft(90)) {
            game.newView();
          }
          break;
        case 39: //right
          if (game.getIsMovingAnimate()) return;
          if (game.moveLeft(180)) {
            game.newView();
          }
          break;
        case 40: //down
          event.preventDefault();
          if (game.getIsMovingAnimate()) return;
          if (game.moveLeft(270)) {
            game.newView();
          }
          break;
      }
    });
  }
  var start = function () {
    game = new Game();
    game.init();
    if(!hasInitEvnet) {
      initEvent();
      hasInitEvnet = true;
    }
  }
  this.start = start;
}
$(function () {
  var local = new Local();
  local.start();
});
