function Local() {
  // 游戏对象
  var game;
  // 下落时间间隔
  var INTERVER;
  // 游戏等级
  var level;
  // 等级时间间隔对照表 5个等级
  var levelToInterval = [200, 170, 140, 110, 80];
  // 定时器
  var timer;
  // 计时
  var timeStamp = 30;
  var timeStart;
  // 绑定键盘事件
  var bindKeyEvent = function (gameOverArea) {
    document.onkeydown = function (e) {
      e = e || window.event;
      var keyCode = e.keyCode;
      switch (keyCode) {
        case 32: game.fall(); break;
        case 37: game.left(); break;
        case 38: game.rotate(); break;
        case 39: game.right(); break;
        case 40: game.down(); break;
        default: break;
      }
    }
    gameOverArea.onclick = function () {
      this.style.display = 'none';
      start();
    }
  }
  var start = function start() {
    var scoreArea = document.getElementById('score');
    var timeArea = document.getElementById('time');
    var gameArea = document.getElementById('game');
    var nextArea = document.getElementById('next');
    var levelArea = document.getElementById('level');
    var gameOverArea = document.getElementById('gameOver');
    level = 1;
    INTERVER = levelToInterval[level - 1];
    
    game = new Game();
    game.init(gameArea, nextArea, timeArea, scoreArea, levelArea, gameOverArea, level);
    bindKeyEvent(gameOverArea);
    timeStart = Date.now();
    timer = setInterval(move, INTERVER);
  }
  var stop = function () {
    clearInterval(timer);
    document.onkeydown = null;
  }
  var timeFun = function () {
    var interval = Date.now() - timeStart;
    interval = ~~(interval/1000);
    game.setTime(interval);
    interval = ~~(interval / timeStamp);
    return interval;
  }
  var checkLevel = function (_level) {
    if (_level <= 5 && _level >= 1 && level < _level) {
      level = _level;
      INTERVER = levelToInterval[level - 1];
      clearInterval(timer);
      timer = setInterval(move, INTERVER);
      game.setLevel(level);
    }
  }
  var move = function () {
    var _level = timeFun() + 1;
    if (!game.down()) {
      game.fixed();
      var line = game.checkClear();
      game.addScore(line);
      if(game.checkGameOver()) {
        stop();
        game.gameOver();
      }else {
        game.genarateNext();
      }
    }
    checkLevel(_level);
  }
  this.start = start;
}
