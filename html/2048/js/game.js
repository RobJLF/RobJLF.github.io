function Game() {
  var gridArea = $("#grid-container");
  var tileArea = $(".tile-container").eq(0);
  var scoreArea = $("#score");
  var increaseScoreArea = $("#increaseScore")[0];
  var gameOverArea = $("#gameoverdiv");

  var windowWidth;
  var containerSize;
  var cellSize;
  var cellInterval;
  var ratio;


  var BOARDSIZE = 4;
  var moveTime = 100;
  var showTime = 100;
  var mergeTime = 80;
  var isMovingAnimate = false;
  var board = new Array(BOARDSIZE);
  // board中为0的位子的下标
  var boardAllow = new Array();
  // 移动过后board中哪些位置进行了融合
  var boardMerge = new Array();
  // 对融合的位置产生动画
  var boardMergeAnimate = new Array();
  var BgColorOject = {
    0: "transparent",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "edcf72",
    256: "#edcc61",
    512: "#9c0",
    1024: "#33b5e5",
    2048: "#09c",
    4096: "#a6c",
    8192: "#93c"
  };
  var score = 0;
  var increaseScore = 0;


  // 通过i j获得方块的top
  var getPosTop = function (i, j) {
    return cellInterval + i * (cellInterval+cellSize);
  }
  // 通过i j获得方块的left
  var getPosLeft = function (i, j) {
    return cellInterval + j * (cellInterval + cellSize);
  }
  // 通过方块的数值获得方块得前景色
  var getColorByNumber = function (num) {
    if (num <= 4) {
      return "#776e65"
    }
    return "white";
  }
  // 通过方块的数值获得方块得背景色
  var getBgColorByNumber = function (num) {
    return BgColorOject[num];
  }
  // 判断board中是否已经没有不为0的方块 没有足够的空间生成新的方块了
  var nospace = function (board) {
    for (let i = 0; i < BOARDSIZE; i++) {
      for (let j = 0; j < BOARDSIZE; j++) {
        if (board[i][j] == 0)
          return false;
      }
    }
    return true;
  }
  // 通过tileCell的坐标和其内容数值设置传入的tileCell元素的位移和颜色风格
  var tileCellInit = function (i, j, num, tileCell, size, pos) {
    size = size == null ? cellSize : size;
    pos = pos == null ? 0 : pos;
    if (num !== 0) {
      tileCell.text(board[i][j]);
      if(100< num && num < 1000) {
        tileCell.css("font-size",50 * ratio + "px");
      } else if (1000 < num) {
        tileCell.css("font-size", 40 * ratio + "px");
      }
    }
    tileCell = tileCell || $("#tile-cell-" + i + "-" + j);
    tileCell.css("width", size).css("height", size);
    tileCell.css("top", getPosTop(i, j) + pos).css("left", getPosLeft(i, j) + pos);
    tileCell.css("color", getColorByNumber(num));
    tileCell.css("background-color", getBgColorByNumber(num));
  }

  var boardMergeInit = function () {
    for (let i = 0; i < BOARDSIZE; i++) {
      for (let j = 0; j < BOARDSIZE; j++) {
        boardMerge[i][j] = false;
      }
    }
  }
  // 每当board数组的内容发生变化时 调用该函数更新其空缺数组
  var boardAllowInit = function () {
    boardAllow = [];
    for (let i = 0; i < BOARDSIZE; i++) {
      for (let j = 0; j < BOARDSIZE; j++) {
        if (board[i][j] == 0) {
          boardAllow.push(i * 4 + j);
        }
      }
    }
  }
  // 生成新的tileCell之后会调用此函数并将此tileCell添加至tileArea
  var showNumberWithAnimation = function (i, j, num) {
    // 生成一个新的tileCell，并指定相应的id和class
    let tileCell = $("<div>", {
      "class": "tile-cell",
      "id": "tile-cell-" + i + "-" + j
    });
    // 对新生成的tileCell进行css初始化
    tileCellInit(i, j, num, tileCell, 0, cellSize/2);
    tileArea.append(tileCell);
    // 调用animate，产生动画效果
    tileCell.animate({
      width: cellSize,
      height: cellSize,
      top: getPosTop(i, j),
      left: getPosLeft(i, j)
    }, showTime);
  }


  // 在游戏开始或者成功移动一步之后生成新的2或者4号tileCell，然后插入到board并更新到tileArea中
  var generateOneNumber = function () {
    // 如果board已经装满，那么无法生成，我觉得这一步在逻辑上是无效的
    if (nospace(board)) {
      return false;
    }
    //随机一个位置，通过boardAllow数组
    let random = Math.floor(Math.random() * boardAllow.length);
    random = boardAllow[random];
    let randomi = Math.floor(random / 4);
    let randomj = random % 4;
    //随即一个数字
    let randomNumber = Math.random()*10 < 9 ? 2 : 4;
    //在随机位置显示随机数字，并且更新board和boardAllow
    board[randomi][randomj] = randomNumber;
    boardAllowInit();
    showNumberWithAnimation(randomi, randomj, randomNumber);
    return true;
  }
  // 初始化board数组
  var initBoardGrid = function () {
    for (let i = 0; i < BOARDSIZE; i++) {
      board[i] = new Array(BOARDSIZE);
      boardMerge[i] = new Array(BOARDSIZE);
      for (let j = 0; j < BOARDSIZE; j++) {
        board[i][j] = 0;
        boardMerge[i][j] = false;
      }
    }
    // boardAllow一定和board保持同步
    boardMergeAnimate = doRotateByAngle(0, boardMerge);
    boardAllowInit();
  }

  var showMergeWithAnimate = function (tileCell) {
    var width = tileCell.width();
    var height = tileCell.height();
    var top = tileCell.position().top;
    var left = tileCell.position().left;
    var change = width * 0.1;
    tileCell.animate({
      width: width + change*2,
      height: height + change * 2,
      top: top - change,
      left:left - change
    }, mergeTime/2)
    .animate({
      width: width,
      height: height,
      top: top,
      left: left
    }, mergeTime / 2);

  }

  var windowResize = function () {
    let windowWidthCurrent = $(window).outerWidth();
    if (windowWidth <= 520 && windowWidthCurrent > 520 || windowWidth > 520 && windowWidthCurrent <= 520) {
      adaptToDivice();
      updataBoardView();
    }
      
  }
  var adaptToDivice = function () {
    windowWidth = $(window).outerWidth();
    if (windowWidth <= 520) {
      containerSize = 280;
      cellSize = 57.5;
      cellInterval = 10;
      ratio = 0.575;
    } else {
      containerSize = 500;
      cellSize = 100;
      cellInterval = 20;
      ratio = 1;
    }
  }

  // 删除之前的tile-cell 通过board数组在页面上生成相应的tile-cell
  var updataBoardView = function () {
    $(".tile-cell").remove();
    for (let i = 0; i < BOARDSIZE; i++) {
      for (let j = 0; j < BOARDSIZE; j++) {
        if (board[i][j] != 0) {
          let tileCell = $("<div>", {
            "class": "tile-cell",
            "id": "tile-cell-" + i + "-" + j
          });
          tileCellInit(i, j, board[i][j], tileCell, cellSize, 0);
          tileArea.append(tileCell);
          if(boardMergeAnimate[i][j] && increaseScore != 0) {
            showMergeWithAnimate(tileCell);
          }
        }
      }
    }
    // 操作之后设置分数或则说开始时初始化分数
    if(increaseScore != 0) {
      $(increaseScoreArea).text("+" + increaseScore);
      increaseScoreArea.classList.remove("moveUp");
      setTimeout(() => {
        increaseScoreArea.classList.add("moveUp");
      }, 0);
    }
    score += increaseScore;
    increaseScore = 0;
    scoreArea.text(score);
    // 执行完此任务可以认为tile的移动动画结束了

    isMovingAnimate = false;
    // 将GameOverArea隐藏
    gameOverArea.css("display", "none"); 
  }

  var rotateAngle_0 = function (boardOrCoordinate) {
    if (Array.isArray(boardOrCoordinate)) {
      var boardRotate = [
        [],
        [],
        [],
        []
      ];
      for (let i = 0; i < BOARDSIZE; i++) {
        for (let j = 0; j < BOARDSIZE; j++) {
          boardRotate[i][j] = boardOrCoordinate[i][j];
        }
      }
      return boardRotate;
    } else {
      return {
        "i": boardOrCoordinate.i,
        "j": boardOrCoordinate.j
      }
    }
  }

  var rotateAngle_90 = function (boardOrCoordinate) {
    if (Array.isArray(boardOrCoordinate)) {
      var boardRotate = [
        [],
        [],
        [],
        []
      ];
      for (let i = 0; i < BOARDSIZE; i++) {
        for (let j = 0; j < BOARDSIZE; j++) {
          boardRotate[-j + 3][i] = boardOrCoordinate[i][j];
        }
      }
      return boardRotate;
    } else {
      return {
        "i": -boardOrCoordinate.j + 3,
        "j": boardOrCoordinate.i
      }
    }
  }

  var rotateAngle_180 = function (boardOrCoordinate) {
    if (Array.isArray(boardOrCoordinate)) {
      var boardRotate = [
        [],
        [],
        [],
        []
      ];
      for (let i = 0; i < BOARDSIZE; i++) {
        for (let j = 0; j < BOARDSIZE; j++) {
          boardRotate[-i + 3][-j + 3] = boardOrCoordinate[i][j];
        }
      }
      return boardRotate;
    } else {
      return {
        "i": -boardOrCoordinate.i + 3,
        "j": -boardOrCoordinate.j + 3
      }
    }
  }

  var rotateAngle_270 = function (boardOrCoordinate) {
    if (Array.isArray(boardOrCoordinate)) {
      var boardRotate = [
        [],
        [],
        [],
        []
      ];
      for (let i = 0; i < BOARDSIZE; i++) {
        for (let j = 0; j < BOARDSIZE; j++) {
          boardRotate[j][-i + 3] = boardOrCoordinate[i][j];
        }
      }
      return boardRotate;
    } else {
      return {
        "i": boardOrCoordinate.j,
        "j": -boardOrCoordinate.i + 3
      }
    }
  }
  
  var doRotateByAngle = function (angle, boardOrCoordinate) {
    switch (angle) {
      case 0:
        return rotateAngle_0(boardOrCoordinate);;
      case 360:
        return rotateAngle_0(boardOrCoordinate);;
      case 90:
        return rotateAngle_90(boardOrCoordinate);
      case 180:
        return rotateAngle_180(boardOrCoordinate);
      case 270:
        return rotateAngle_270(boardOrCoordinate);
      default:
        return rotateAngle_0(boardOrCoordinate);;
    }
  }
  // 判断第i行的k列和j列之间是否存在非0值
  var noBlockHorizontal = function (row, right, left, boardRotate) {
    for (let index = left + 1; index < right; index++) {
      if (boardRotate[row][index] != 0) {
        return false;
      }
    }
    return true;
  }
  // 判断
  var showMoveAnimation = function (rowFrom, colFrom, rowTo, colTo) {
    let tileCell = $("#tile-cell-" + rowFrom + "-" + colFrom);
    tileCell.animate({
      "left": getPosLeft(rowTo, colTo),
      "top": getPosTop(rowTo, colTo)
    }, moveTime);
  }

  var showMoveAnimationByAngle = function (i, j, k, angle) {
    let from = {};
    let to = {};
    from = doRotateByAngle(360 - angle, {
      "i": i,
      "j": j
    });
    to = doRotateByAngle(360 - angle, {
      "i": i,
      "j": k
    });
    showMoveAnimation(from.i, from.j, to.i, to.j);
  }

  var canMoveLeft = function (boardRotate) {
    for (let i = 0; i < BOARDSIZE; i++) {
      for (let j = 1; j < BOARDSIZE; j++) { //从1开始 第一列不需要判断是否能够左移动
        if (boardRotate[i][j] != 0 && (boardRotate[i][j - 1] == 0 || boardRotate[i][j - 1] == boardRotate[i][j])) {
          return true;
        }
      }
    }
    return false;
  }


  // 先旋转angle度在进行左移判断
  var moveLeft = function (angle) {
    let boardRotate = doRotateByAngle(angle, board);
    if (!canMoveLeft(boardRotate)) {
      return false;
    }
    increaseScore = 0;
    // 按move的逻辑改变board的值，之后便是调用移动动画，然后是生成新元素和动画，最后是merge的动画效果
    for (let i = 0; i < BOARDSIZE; i++) {
      for (let j = 1; j < BOARDSIZE; j++) {
        // 判断board[i][j]是否能够左移 如果能够左移则改变board并调用移动动画
        if (boardRotate[i][j] != 0) {
          for (let k = 0; k < j; k++) {
            if (noBlockHorizontal(i, j, k, boardRotate)) {
              if (boardRotate[i][k] == 0) {
                // 进行移动
                // console.log("before:", doRotateByAngle(360 - angle, boardRotate))
                boardRotate[i][k] = boardRotate[i][j];
                boardRotate[i][j] = 0;
                // console.log("after:", doRotateByAngle(360 - angle, boardRotate))
                showMoveAnimationByAngle(i, j, k, angle);
                break;
              } else if (boardRotate[i][k] == boardRotate[i][j] && !boardMerge[i][k]) {
                // 进行合成
                // console.log("before:", doRotateByAngle(360 - angle, boardRotate))
                boardRotate[i][k] += boardRotate[i][j];
                boardRotate[i][j] = 0;
                boardMerge[i][k] = true;
                increaseScore += boardRotate[i][k];
                // console.log("after:",doRotateByAngle(360 - angle, boardRotate))
                showMoveAnimationByAngle(i, j, k, angle, boardRotate, board);
                break;
              }
            }
          }
        }
      }
    }
    isMovingAnimate = true;
    board = doRotateByAngle(360-angle, boardRotate);
    boardMergeAnimate = doRotateByAngle(360-angle, boardMerge);
    boardMergeInit();
    boardAllowInit();
    return true;
  }

  var showGameOver = function () {
    gameOverArea.css("display", "block");
  }

  var isGameOver = function () {
    if (canMoveLeft(doRotateByAngle(0, board)) || canMoveLeft(doRotateByAngle(90, board)) || 
    canMoveLeft(doRotateByAngle(180, board)) || canMoveLeft(doRotateByAngle(270, board))) {
      /* console.log(canMoveLeft(doRotateByAngle(0, board)), canMoveLeft(doRotateByAngle(90, board)),
      canMoveLeft(doRotateByAngle(180, board)), canMoveLeft(doRotateByAngle(270, board))) */
      return false;
    }
    showGameOver();
    return true;
  }

  var newView = function () {
    setTimeout(function (){
      updataBoardView();
      generateOneNumber();
      isGameOver();
    }, showTime);
  }


  var init = function () {
    //初始化棋盘数据board 并通过渲染两个新的tile
    adaptToDivice();
    initBoardGrid();
    updataBoardView();
    generateOneNumber();
    generateOneNumber();
  }
  this.moveTime = moveTime;
  this.init = init;
  this.updataBoardView = updataBoardView;
  this.generateOneNumber = generateOneNumber;
  this.moveLeft = moveLeft;
  this.newView = newView;
  this.getIsMovingAnimate = function() {return isMovingAnimate};
  this.windowWidth = function () {return windowWidth};
  this.windowResize = windowResize;
}
