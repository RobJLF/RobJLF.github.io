Square.allType = {
  0 : {0 : [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]],
      1: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
      2: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]],
      3: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
  },
  1: {
    0: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
    1: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
    2: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
    3: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]]
  },
  2: {
    0: [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
    1: [
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]],
    2: [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
    3: [
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]]
  },
  3: {
    0: [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
    1: [
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]],
    2: [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
    3: [
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]]
  },
  4: {
    0: [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
    1: [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]],
    2: [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]],
    3: [
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]]
  },
  5: {
    0: [
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]],
    1: [
      [1, 1, 1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]],
    2: [
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]],
    3: [
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]]
  },
  6: {
    0: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]],
    1: [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0]],
    2: [
      [1, 1, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0]],
    3: [
      [1, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]]
  }
}

Square.getRandomType = function () {
  return Math.floor(Math.random() * 7);
}
Square.getRandomDir = function () {
  return Math.floor(Math.random() * 4);
}
function Square(dir, type) {
  this.origin = {
    x:0,
    y:3
  }
  // 旋转的初始方向
  this.dir = dir || 0;
  // 旋转数组
  this.rotates = Square.allType[type || 0];
  //  显示数组
  this.data = this.rotates[this.dir];
}
Square.prototype.canRotate = function (isValid) {
  var dir = (this.dir + 1) % 4;
  var data = this.rotates[dir];
  var pos = {};
  pos.x = this.origin.x;
  pos.y = this.origin.y;
  return isValid(pos, data);
}
Square.prototype.rotate = function () {
  this.dir = (this.dir + 1) % 4;
  this.data = this.rotates[this.dir];
}

Square.prototype.canDown = function (isValid) {
  var pos = {};
  pos.x = this.origin.x + 1;
  pos.y = this.origin.y;
  return isValid(pos, this.data);
}
Square.prototype.down = function () {
  this.origin.x += 1;
}

Square.prototype.canLeft = function (isValid) {
  var pos = {};
  pos.x = this.origin.x;
  pos.y = this.origin.y - 1;
  return isValid(pos, this.data);
}
Square.prototype.left = function () {
  this.origin.y -= 1;
}

Square.prototype.canRight = function (isValid) {
  var pos = {};
  pos.x = this.origin.x;
  pos.y = this.origin.y + 1;
  return isValid(pos, this.data);
}
Square.prototype.right = function () {
  this.origin.y += 1;
}

