import { Sprite, Container, Ticker, Graphics } from "pixi.js-legacy";
import { app, blockSize } from "./index";
import { randomInt } from "./functions";
import { Block } from "./Block";
export class Board {
    constructor() {
        this.board = []; // Row 0-19 (top-bottom), column 0-9 (left-right)
        this.bSprite = Sprite.from(app.loader.resources['back'].texture);
        this.boardTicker = new Ticker;
        this.blocks = new Container();
        this.createBoard();
        this.activeBlock = new Block(randomInt(1, 7));
        this.nextBlock = new Block(randomInt(1, 7));
        this.blocks = this.blocksContainer();
        this.blocks.addChild(this.activeBlock.res, this.nextBlock.res);
        app.stage.addChild(this.blocks);
        this.positionBlocks();
        window.addEventListener('keydown', (e) => {
            this.handleKey(e);
        });
        for (let i = 0; i < 20; i++) {
            this.board[i] = [];
        }
        let t = new Date().getTime();
        this.boardTicker.add((delta) => {
            if (Date.now() - t > 300) {
                if (!this.boardCollision("down")) {
                    this.activeBlock.res.y += blockSize;
                }
                else {
                    this.stopActive();
                }
                t = new Date().getTime();
            }
        });
        this.boardTicker.start();
    }
    blocksContainer() {
        let c = new Container();
        const m = new Graphics();
        m.beginFill(0x000000);
        m.drawRect(0, this.bSprite.getBounds().top, window.innerWidth, this.bSprite.getBounds().height);
        m.endFill();
        c.mask = m;
        return c;
    }
    stopActive() {
        this.activeBlock.res.children.forEach(el => {
            let r = Math.round((el.getBounds().top - this.bSprite.getBounds().top) / blockSize);
            let c = Math.round((el.getBounds().left - this.bSprite.getBounds().left) / blockSize);
            this.board[r][c] = el;
        });
        this.lineCheck();
        this.activeBlock = this.nextBlock;
        this.nextBlock = new Block(randomInt(1, 7));
        this.blocks.addChild(this.nextBlock.res);
        this.positionBlocks();
    }
    positionBlocks() {
        this.activeBlock.res.x = (this.bSprite.getBounds().left + 6 * blockSize - this.activeBlock.res.width);
        this.activeBlock.res.y = (this.bSprite.getBounds().top - this.activeBlock.res.height);
        this.nextBlock.res.y = this.bSprite.getBounds().top;
        this.nextBlock.res.x = this.bSprite.getBounds().left - this.nextBlock.res.width - blockSize;
    }
    lineCheck() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j of this.board[i]) {
                if (j == null) {
                    break;
                }
                else {
                    if (this.board[i].indexOf(j) == 9) {
                        this.board[i].forEach(el => {
                            el.destroy();
                        });
                        this.board[i].splice(0, 10);
                        let k = i;
                        for (k; k >= 1; k--) {
                            this.board[k] = this.board[k - 1];
                            this.board[k].forEach(kc => {
                                kc.y += blockSize;
                            });
                        }
                        console.log(this.board);
                    }
                }
            }
        }
    }
    handleKey(e) {
        switch (e.key) {
            case "ArrowUp":
                {
                    this.activeBlock.changeState(this.activeBlock.res.getBounds().left - this.bSprite.getBounds().left, this.bSprite.getBounds().bottom - this.activeBlock.res.getBounds().bottom, this.board, this.bSprite, true);
                }
                break;
            case "ArrowDown": {
                if (!this.boardCollision("down")) {
                    this.activeBlock.res.y += blockSize;
                }
                break;
            }
            case "ArrowLeft": {
                if (!this.boardCollision("left")) {
                    this.activeBlock.res.x -= blockSize;
                }
                break;
            }
            case "ArrowRight": {
                if (!this.boardCollision("right")) {
                    this.activeBlock.res.x += blockSize;
                }
                break;
            }
        }
    }
    boardCollision(direction) {
        switch (direction) {
            case "down": {
                let res = false;
                if (this.activeBlock.res.getBounds().bottom == this.bSprite.getBounds().bottom) {
                    res = true;
                }
                else {
                    this.activeBlock.res.children.forEach(el => {
                        let row = Math.round((el.getBounds().top - this.bSprite.getBounds().top) / blockSize);
                        let col = Math.round((el.getBounds().left - this.bSprite.getBounds().left) / blockSize);
                        if (row >= 0 && row <= 18 && this.board[row + 1][col] != null) {
                            res = true;
                            return;
                        }
                    });
                }
                return res;
            }
            case "left": {
                let res = false;
                if (this.activeBlock.res.getBounds().left - blockSize / 2 < this.bSprite.getBounds().left) {
                    res = true;
                }
                else {
                    this.activeBlock.res.children.forEach(el => {
                        let row = Math.round((el.getBounds().top - this.bSprite.getBounds().top) / blockSize);
                        let col = Math.round((el.getBounds().left - this.bSprite.getBounds().left) / blockSize);
                        if (row >= 0 && row <= 18 && this.board[row][col - 1] != null) {
                            res = true;
                            return;
                        }
                    });
                }
                return res;
            }
            case "right": {
                let res = false;
                if (this.activeBlock.res.getBounds().right + blockSize / 2 > this.bSprite.getBounds().right) {
                    res = true;
                }
                else {
                    this.activeBlock.res.children.forEach(el => {
                        let row = Math.round((el.getBounds().top - this.bSprite.getBounds().top) / blockSize);
                        let col = Math.round((el.getBounds().left - this.bSprite.getBounds().left) / blockSize);
                        if (row >= 0 && row <= 18 && this.board[row][col + 1] != null) {
                            res = true;
                            return;
                        }
                    });
                }
                return res;
            }
        }
    }
    createBoard() {
        this.bSprite.height = 20 * blockSize;
        this.bSprite.width = 10 * blockSize;
        this.bSprite.anchor.set(0.5, 1);
        this.bSprite.position.set(window.innerWidth / 2, window.innerHeight);
        app.stage.addChild(this.bSprite);
    }
}
