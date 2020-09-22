import { Sprite, Container, Ticker, DisplayObject, Graphics, Text } from "pixi.js-legacy";
import {app, blockSize} from "./index"
import {randomInt} from "./functions"
import {Block} from "./Block"

export class Board {
    board: DisplayObject[][] = []; // Row 0-19 (top-bottom), column 0-9 (left-right)
    activeBlock: Block;
    nextBlock: Block;
    bSprite: Sprite = Sprite.from(app.loader.resources['back'].texture);
    boardTicker = new Ticker;
    blocks = new Container();
    linesDestroyed = 0;
    playing: boolean = true;
    level: number = 3;
    spdLevels: number[] = [1000, 950, 900, 800, 700, 600, 500, 350, 200, 100, 80, 50];
    textNodes: Text[] = []
    constructor(){
        this.createBoard();
        this.levelCheck();
        this.handleText();

        this.activeBlock = new Block(randomInt(1, 7));
        this.nextBlock = new Block(randomInt(1, 7));

        this.blocks = this.blocksContainer();

        this.blocks.addChild(this.activeBlock.res, this.nextBlock.res)
        app.stage.addChild(this.blocks)

        this.positionBlocks();

        window.addEventListener('keydown', (e) => {
            this.handleKey(e);
        })

        for(let i = 0; i < 20; i++){
            this.board[i] = [];
        }
        let t: number = new Date().getTime();

        this.boardTicker.add((delta) => {
            if(Date.now() - t > this.spdLevels[this.level]){
                if(!this.boardCollision("down")){
                    this.activeBlock.res.y += blockSize;
                }else{
                    this.stopActive();
                }
                t = new Date().getTime();
            }
        })

        this.boardTicker.start();
    }

    blocksContainer(): Container{
        let c = new Container();
        const m = new Graphics();
        m.beginFill(0x000000);
        m.drawRect(0, this.bSprite.getBounds().top, window.innerWidth, this.bSprite.getBounds().height);
        m.endFill();
        c.mask = m;
        return c;
    }

    levelCheck(){
        if(this.linesDestroyed > 0 && this.level < 12 && this.linesDestroyed % 10 == 0){
            this.level++;
        }
    }

    end(){
        this.boardTicker.stop();
        this.playing = false;
    }

    stopActive(){
        this.activeBlock.res.children.forEach(el => {
            let r: number = 0;
            let c: number = 0;
            r = Math.round((el.getBounds().top - this.bSprite.getBounds().top) / blockSize);
            c = Math.round((el.getBounds().left - this.bSprite.getBounds().left) / blockSize);
            if(r <= 0){
                this.end();
            }else{
                this.board[r][c] = el;
            }
        })

        this.lineCheck()

        this.activeBlock = this.nextBlock;

        this.nextBlock = new Block(randomInt(1, 7));

        this.blocks.addChild(this.nextBlock.res);

        this.positionBlocks();

        this.levelCheck();
        this.handleText();
    }

    positionBlocks(){
        this.activeBlock.res.x = (this.bSprite.getBounds().left + 6 * blockSize - this.activeBlock.res.width);
        this.activeBlock.res.y = (this.bSprite.getBounds().top - this.activeBlock.res.height);

        this.nextBlock.res.y = this.bSprite.getBounds().top + (6 * blockSize - this.nextBlock.res.height) / 2;
        this.nextBlock.res.x = this.bSprite.getBounds().left - (6 * blockSize + this.nextBlock.res.width) / 2;
    }

    lineCheck(){
        for(let i = 0; i < this.board.length; i++) {
            for(let j of this.board[i]){
                if(j == null){
                    break;
                }else{
                    if(this.board[i].indexOf(j) == 9){
                        this.board[i].forEach(el => {
                            el.destroy();
                        })
                        this.board[i].splice(0,10);
                        let k = i;
                        for(k; k >= 0; k--){
                            if(k == 0){
                                this.board[k] = [];
                            }else{
                                this.board[k] = this.board[k-1];
                                this.board[k].forEach(kc => {
                                    kc.y += blockSize;
                                })
                            }
                        }
                        this.linesDestroyed++;
                    }
                }
            }
        }
    }

    handleKey(e: KeyboardEvent){
        if(this.playing){
            switch (e.key){
                case "ArrowUp": 
                case "z":{
                    this.activeBlock.changeState(this.activeBlock.res.getBounds().left - this.bSprite.getBounds().left, 
                    this.bSprite.getBounds().bottom - this.activeBlock.res.getBounds().bottom
                    ,this.board, this.bSprite, true);
                    break;
                }
                case "x":{
                    this.activeBlock.changeState(this.activeBlock.res.getBounds().left - this.bSprite.getBounds().left, 
                    this.bSprite.getBounds().bottom - this.activeBlock.res.getBounds().bottom,
                    this.board, 
                    this.bSprite, 
                    false);
                    break;
                }
                case "ArrowDown": {
                    if(!this.boardCollision("down")){
                        this.activeBlock.res.y += blockSize;
                    }
                    break;
                }
                case "ArrowLeft": {
                    if(!this.boardCollision("left")){
                        this.activeBlock.res.x -= blockSize;
                    }
                    break;
                }
                case "ArrowRight": {
                    if(!this.boardCollision("right")){
                        this.activeBlock.res.x += blockSize;
                    }
                    break;
                }
            }
        }
    }

    boardCollision(direction: string){
        switch (direction) {
            case "down": {
                let res = false;
                if(this.activeBlock.res.getBounds().bottom == this.bSprite.getBounds().bottom){
                    res = true;
                }else{
                    this.activeBlock.res.children.forEach(el => {
                        let row = Math.round((el.getBounds().top - this.bSprite.getBounds().top) / blockSize);
                        let col = Math.round((el.getBounds().left - this.bSprite.getBounds().left) / blockSize);
                        if(row >= 0 && row <= 18 && this.board[row+1][col] != null){
                            res = true;
                            return;
                        }
                    })
                }
                return res;
            }
            case "left": {
                let res = false;
                if(this.activeBlock.res.getBounds().left - blockSize / 2 < this.bSprite.getBounds().left){
                    res = true;
                }else{
                    this.activeBlock.res.children.forEach(el => {
                        let row = Math.round((el.getBounds().top - this.bSprite.getBounds().top) / blockSize);
                        let col = Math.round((el.getBounds().left - this.bSprite.getBounds().left) / blockSize);
                        if(row >= 0 && row <= 18 && this.board[row][col-1] != null){
                            res = true;
                            return;
                        }
                    })
                }
                return res;
            }
            case "right": {
                let res = false;
                if(this.activeBlock.res.getBounds().right + blockSize / 2 > this.bSprite.getBounds().right){
                    res = true;
                }else{
                    this.activeBlock.res.children.forEach(el => {
                        let row = Math.round((el.getBounds().top - this.bSprite.getBounds().top) / blockSize);
                        let col = Math.round((el.getBounds().left - this.bSprite.getBounds().left) / blockSize);
                        if(row >= 0 && row <= 18 && this.board[row][col+1] != null){
                            res = true;
                            return;
                        }
                    })
                }
                return res;
            }
        }
    }

    createBoard(){
        this.bSprite.height = 20 * blockSize;
        this.bSprite.width = 10 * blockSize;
        this.bSprite.anchor.set(0.5, 1)
        this.bSprite.position.set(window.innerWidth / 2, window.innerHeight)
        app.stage.addChild(this.bSprite);

        let next = new Graphics();
        next.beginFill(0x242424)
        next.drawRect(this.bSprite.getBounds().left - 6 * blockSize, this.bSprite.getBounds().top, 6 * blockSize, 6 * blockSize)
        next.endFill();
        app.stage.addChild(next)

        let lvlLabel = new Text('Level ',{
            fontFamily: 'Lucida Console',
            fontSize: blockSize,
            align: 'left'
        })

        lvlLabel.position.set(this.bSprite.getBounds().right, this.bSprite.getBounds().top);
        app.stage.addChild(lvlLabel);

        let lvl = new Text('1',{
            fontFamily: 'Lucida Console',
            fontSize: blockSize,
        })
        lvl.position.set(this.bSprite.getBounds().right, this.bSprite.getBounds().top + blockSize * 3/2);
        app.stage.addChild(lvl);
        this.textNodes[0] = lvl;

        let linesLabel = new Text('Lines cleared ',{
            fontFamily: 'Lucida Console',
            fontSize: blockSize,
            align: 'left'
        })

        linesLabel.position.set(this.bSprite.getBounds().right, this.bSprite.getBounds().top + 3 * blockSize)
        app.stage.addChild(linesLabel)

        let lines = new Text('0',{
            fontFamily: 'Lucida Console',
            fontSize: blockSize,
        })
        this.textNodes[1] = lines;
        lines.position.set(this.bSprite.getBounds().right, this.bSprite.getBounds().top + blockSize * 9/2);
        app.stage.addChild(lines);
    }

    handleText(){
        this.textNodes[0].text = (this.level).toString();
        this.textNodes[1].text = (this.linesDestroyed).toString();
    }
}