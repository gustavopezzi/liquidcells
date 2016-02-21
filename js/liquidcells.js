'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

document.addEventListener("DOMContentLoaded", function (event) {
    var cellSize = 20;
    var cellList = null;

    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var Cell = function () {
        function Cell(col, row) {
            _classCallCheck(this, Cell);

            this.colIndex = col;
            this.rowIndex = row;
            this.x = col * cellSize;
            this.y = row * cellSize;
            this.color = null;
            this.nextState = Math.floor((this.x / windowWidth + this.y / windowHeight) * 14);
            this.state = this.nextState;
            this.lastState = 0;
            this.neighbours = [];
        }

        _createClass(Cell, [{
            key: 'draw',
            value: function draw() {
                this.state = this.nextState;
                this.color = 'rgb(0, 0, ' + this.state + ')';
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, cellSize, cellSize);
            }
        }, {
            key: 'updateState',
            value: function updateState() {
                var sum = 0;
                for (var i = 0; i < 8; i++) {
                    sum += this.neighbours[i].state;
                }
                var average = Math.floor(sum / 8);

                if (average == 255) {
                    this.nextState = 0;
                } else if (average == 0) {
                    this.nextState = 255;
                } else {
                    this.nextState = this.state + average;
                    if (this.lastState > 0) {
                        this.nextState -= this.lastState;
                    }
                    if (this.nextState > 255) {
                        this.nextState = 255;
                    } else if (this.nextState < 0) {
                        this.nextState = 0;
                    }
                }
                this.lastState = this.state;
            }
        }, {
            key: 'resetColor',
            value: function resetColor() {
                this.nextState = 255;
                this.draw();
            }
        }]);

        return Cell;
    }();

    var CellList = function () {
        function CellList() {
            _classCallCheck(this, CellList);

            this.arr = [];
            this.rowLength = null;
            this.columnLength = null;
        }

        _createClass(CellList, [{
            key: 'init',
            value: function init() {
                this.rowLength = Math.floor(windowHeight / cellSize);
                this.columnLength = Math.floor(windowWidth / cellSize);
                for (var i = 0; i < this.columnLength; i++) {
                    this.arr[i] = [];
                    for (var j = 0; j < this.rowLength; j++) {
                        this.arr[i][j] = new Cell(i, j);
                    }
                }
            }
        }, {
            key: 'setNeighbour',
            value: function setNeighbour() {
                for (var i = 0; i < this.columnLength; i++) {
                    for (var j = 0; j < this.rowLength; j++) {
                        var above = j - 1;
                        var below = j + 1;
                        var left = i - 1;
                        var right = i + 1;

                        if (above < 0) {
                            above = this.rowLength - 1;
                        }
                        if (below == this.rowLength) {
                            below = 0;
                        }
                        if (left < 0) {
                            left = this.columnLength - 1;
                        }
                        if (right == this.columnLength) {
                            right = 0;
                        }

                        this.arr[i][j].neighbours.push(this.arr[left][above]);
                        this.arr[i][j].neighbours.push(this.arr[left][j]);
                        this.arr[i][j].neighbours.push(this.arr[left][below]);
                        this.arr[i][j].neighbours.push(this.arr[i][below]);
                        this.arr[i][j].neighbours.push(this.arr[right][below]);
                        this.arr[i][j].neighbours.push(this.arr[right][j]);
                        this.arr[i][j].neighbours.push(this.arr[right][above]);
                        this.arr[i][j].neighbours.push(this.arr[i][above]);
                    }
                }
            }
        }, {
            key: 'updateCells',
            value: function updateCells() {
                for (var i = 0; i < this.columnLength; i++) {
                    for (var j = 0; j < this.rowLength; j++) {
                        this.arr[i][j].updateState();
                    }
                }
            }
        }, {
            key: 'drawCells',
            value: function drawCells() {
                for (var i = 0; i < this.columnLength; i++) {
                    for (var j = 0; j < this.rowLength; j++) {
                        this.arr[i][j].draw();
                    }
                }
            }
        }]);

        return CellList;
    }();

    setUpCanvas();

    function setUpCanvas() {
        canvas.width = windowWidth;
        canvas.height = windowHeight;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
    }

    var cellList = new CellList();

    cellList.init();
    cellList.setNeighbour();

    var mousePosition = {
        x: null,
        y: null
    };

    canvas.addEventListener('mousemove', function (e) {
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
    });

    function loop() {
        cellList.updateCells();
        cellList.drawCells();

        var targetCell = cellList.arr[Math.floor(mousePosition.x / cellSize)][Math.floor(mousePosition.y / cellSize)];
        targetCell.resetColor();

        window.requestAnimationFrame(loop);
    }

    loop();
});
