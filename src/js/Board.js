import { Sprite, Ticker } from "pixi.js-legacy";
import { app, blockSize, drawBlock } from "./index";
import { randomInt } from "./functions";
var Board = /** @class */ (function () {
    function Board() {
        var _this = this;
        this.board = [];
        this.move = new Ticker();
        // Add Board and set it's size
        this.boardS = Sprite.from(app.loader.resources['back'].texture);
        app.stage.addChild(this.boardS);
        this.boardS.width = blockSize * 10;
        this.boardS.height = blockSize * 20;
        // Draw blocks
        this.activeBlock = drawBlock(blockSize, randomInt(1, 7));
        this.nextBlock = drawBlock(blockSize, randomInt(1, 7));
        // Add blocks to stage
        app.stage.addChild(this.activeBlock, this.nextBlock);
        // Set positions of blocks
        this.setPosition(true);
        var it = 1;
        this.move.add(function (delta) {
            if (it % Math.round(_this.move.FPS / 6) == 0) {
                console.log(!_this.detectCollision("down"));
                if (!_this.detectCollision("down")) {
                    _this.activeBlock.y += blockSize;
                }
                else {
                    _this.stopActive();
                }
            }
            it++;
        });
        this.move.start();
        window.addEventListener('keydown', function (e) {
            _this.keyListener(e);
        });
    }
    Board.prototype.keyListener = function (e) {
        switch (e.key) {
            case "ArrowLeft":
                if (!this.detectCollision("left")) {
                    this.activeBlock.x -= blockSize;
                }
                break;
            case "ArrowRight":
                if (!this.detectCollision("right")) {
                    this.activeBlock.x += blockSize;
                }
                break;
            case "ArrowUp":
                this.activeBlock.angle += 90;
                break;
            default:
                return;
        }
    };
    Board.prototype.stopActive = function () {
        var _this = this;
        this.activeBlock.children.forEach(function (element) {
            _this.board.push(element);
        });
        this.activeBlock = this.nextBlock;
        this.nextBlock = drawBlock(blockSize, randomInt(1, 7));
        app.stage.addChild(this.nextBlock);
        this.setPosition(false);
    };
    Board.prototype.detectCollision = function (direction) {
        var _this = this;
        var result = false;
        switch (direction) {
            case "down":
                if (this.activeBlock.getBounds().bottom == this.boardS.getBounds().bottom) {
                    result = true;
                }
                else {
                    this.activeBlock.children.forEach(function (el) {
                        _this.board.forEach(function (b) {
                            if (el.getBounds().x == b.getBounds().x) {
                                if (el.getBounds().bottom == b.getBounds().top) {
                                    result = true;
                                }
                            }
                        });
                    });
                }
                return result;
            case "left":
                if (this.activeBlock.getBounds().left == this.boardS.getBounds().left) {
                    result = true;
                }
                else {
                    this.activeBlock.children.forEach(function (el) {
                        _this.board.forEach(function (b) {
                            if (el.getBounds().bottom == b.getBounds().top && el.getBounds().left == b.getBounds().right) {
                                result = true;
                            }
                        });
                    });
                }
                return result;
            case "right":
                if (this.activeBlock.getBounds().right == this.boardS.getBounds().right) {
                    result = true;
                }
                else {
                    this.activeBlock.children.forEach(function (el) {
                        _this.board.forEach(function (b) {
                            if (el.getBounds().bottom == b.getBounds().top && el.getBounds().right == b.getBounds().left) {
                                result = true;
                            }
                        });
                    });
                }
                return result;
        }
    };
    Board.prototype.setPosition = function (board) {
        if (board) {
            this.boardS.anchor.set(0.5, 1);
            this.boardS.position.set(window.innerWidth / 2, window.innerHeight);
        }
        this.activeBlock.position.set(this.boardS.getBounds().left + 4 * blockSize, this.boardS.getBounds().top);
        this.nextBlock.position.set(this.boardS.getBounds().left - 4 * blockSize, this.boardS.getBounds().top);
    };
    return Board;
}());
export { Board };
