function Game() {
  
  var nextData = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  var gameData = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  /**渲染使用的divs */
  var gameDivs = [];
  var nextDivs = [];
  
  var score;
  var getScoreRule = [10, 30, 60, 100];
  var gameArea;
  var nextArea;
  var timeArea;
  var scoreArea;
  var levelArea;
  var gameOverArea;

  /**方块 */
  var curBlock;
  var nextBlock;


  /* 初始化方法，向area区域中添加div，game的私有变量gameDivs和nextDivs会保存这些div
     方便之后的渲染
  */
  function initDivs(data, divs, area) {
    area.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
      var nodeLine = [];
      for (let j = 0; j < data[0].length; j++) {
        var newNode = document.createElement('div');
        newNode.className = 'none';
        newNode.style.top = i * 20 + 'px';
        newNode.style.left = j * 20 + 'px';
        nodeLine.push(newNode);
        area.appendChild(newNode);
      }
      divs.push(nodeLine);
    }
  }
  /* 根据data数据来渲染改变divs的class值 */
  function refreshDivs(data, divs) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[i][j] == 0) {
          divs[i][j].className = 'none';
        }else if(data[i][j] == 1) {
          divs[i][j].className = 'current';
        } else if (data[i][j] == 2){
          divs[i][j].className = 'done';
        }
      }
    }
  }
  // 测试block的位置是否是合法的，也就是说block中有值的地点不越界，也不会与gameData中的非2值重叠
  var placeIsValid = function (pos, data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[0].length; j++) {
        if(!canCoverHere(pos, i, j) && data[i][j] != 0) {
          return false;
        }
      }
    }
    return true;
  }


  var isHereInner = function (aX, aY) {
    if (aX < 0 || aY < 0 || aX >= gameData.length || aY >= gameData[0].length) {
      return false;
    } else {
      return true;
    }
  }
  // 检测curBlock中某个点的位置在gamedata中否出界或者此位置已经存在了不为0的点
  var canCoverHere = function (pos, x, y) {
    var aX = pos.x + x;
    var aY = pos.y + y;
    if (isHereInner(aX, aY) && gameData[aX][aY] != 2) {
      return true;
    }else {
      return false;
    }

  }
  var shouldEliminateHere = function(pos, x, y) {
    var aX = pos.x + x;
    var aY = pos.y + y;
    if (isHereInner(aX, aY) && curBlock.data[x][y] != 0 ) {
      return true;
    } else {
      return false;
    }
  }

  // 清除数据
  var clearData = function (areaData, block) {
    for (let i = 0; i < block.data.length; i++) {
      for (let j = 0; j < block.data[0].length; j++) {
        if (shouldEliminateHere(block.origin, i, j)) {
          areaData[i + block.origin.x][j + block.origin.y] = 0;
        }
      }
    }
  }
  // 设置数据
  var setData = function (areaData, block) {
    for (let i = 0; i < block.data.length; i++) {
      for (let j = 0; j < block.data[0].length; j++) {
        if(canCoverHere(block.origin, i, j)) {
          areaData[i + block.origin.x][j + block.origin.y] = block.data[i][j];
        }
      }
    }
  }
  // block下移动
  var down = function () {
    if(curBlock.canDown(placeIsValid)){
      clearData(gameData, curBlock);
      curBlock.down();
      setData(gameData, curBlock);
      refreshDivs(gameData, gameDivs);
      return true;
    }
    return false;
    
  }
  var left = function () {
    if (curBlock.canLeft(placeIsValid)) {
      clearData(gameData, curBlock);
      curBlock.left();
      setData(gameData, curBlock);
      refreshDivs(gameData, gameDivs);
    }
  }
  var right = function () {
    if (curBlock.canRight(placeIsValid)) {
      clearData(gameData, curBlock);
      curBlock.right();
      setData(gameData, curBlock);
      refreshDivs(gameData, gameDivs);
    }
  }
  var rotate = function () {
    if (curBlock.canRotate(placeIsValid)) {
      clearData(gameData, curBlock);
      curBlock.rotate();
      setData(gameData, curBlock);
      refreshDivs(gameData, gameDivs);
    }
  }
  var fixed = function () {
    for (let i = 0; i < curBlock.data.length; i++) {
      for (let j = 0; j < curBlock.data[0].length; j++) {
        if (isHereInner(curBlock.origin.x + i, curBlock.origin.y + j) && gameData[curBlock.origin.x + i][curBlock.origin.y + j] == 1) {
          gameData[curBlock.origin.x + i][curBlock.origin.y + j] = 2;
        }
      }
    }
    refreshDivs(gameData, gameDivs);
  }
  var genarateNext = function () {
    curBlock = nextBlock;
    nextBlock = new Square(Square.getRandomDir(), Square.getRandomType());
    setData(gameData, curBlock);
    refreshDivs(gameData, gameDivs);
    refreshDivs(nextBlock.data, nextDivs);
  }
  var checkClear = function () {
    var line = 0;
    for (let i = gameData.length - 1; i >= 0; i--) {
      var full = true;
      for (let j = 0; j < gameData[0].length; j++) {
        if(gameData[i][j] != 2) {
          full = false;
          break;
        }
      }
      if (full) {
        for (let m = i; m >= 0; m--) {
          for (let n = 0; n < gameData[0].length; n++) {
            if(m == 0) {
              gameData[m][n] = 0;
            }else {
              gameData[m][n] = gameData[m - 1][n];
            }
          }
        }
        i++;
        line ++;
      }
    }
    return line;
  }

  var checkGameOver = function () {
    if (curBlock.origin.x < 4) {
      return true;
    }else {
      return false;
    }
  }
  var setTime = function (time) {
    timeArea.textContent = time;
  }
  var addScore = function (line) {
    if(0<line && line <= 4) {
      score += getScoreRule[line - 1];
      scoreArea.textContent = score; 
    }
  }
  var setLevel = function (level) {
    levelArea.textContent = level;
  }
  var gameOver = function () {
    gameOverArea.style.display = 'block';
  }
  // 初始化
  function init(gArea, nArea, tArea, sArea, lArea, _gameOverArea, level) {
    gameArea = gArea;
    nextArea = nArea;
    timeArea = tArea;
    scoreArea = sArea;
    levelArea = lArea;
    gameOverArea = _gameOverArea;
    score = 0;
    scoreArea.textContent = score;
    setLevel(level);
    initDivs(gameData, gameDivs, gameArea);
    initDivs(nextData, nextDivs, nextArea);
    curBlock = new Square(Square.getRandomDir(), Square.getRandomType());
    nextBlock = new Square(Square.getRandomDir(), Square.getRandomType());
    setData(gameData, curBlock);
    refreshDivs(gameData, gameDivs);
    refreshDivs(nextBlock.data, nextDivs);
  }
  /**导出API */
  this.init = init;
  this.down = down;
  this.right = right;
  this.left = left;
  this.rotate = rotate;
  this.fixed = fixed;
  this.genarateNext = genarateNext;
  this.checkClear = checkClear;
  this.checkGameOver = checkGameOver;
  this.setTime = setTime;
  this.addScore = addScore;
  this.setLevel = setLevel;
  this.gameOver = gameOver;
  this.fall = function () {while(down());};
}
