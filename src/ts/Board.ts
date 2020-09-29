import { Sprite, Container, Ticker, DisplayObject, Graphics, Text } from "pixi.js-legacy";
import {app, blockSize, start, pause, unpause, endScreen} from "./index"
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
    level: number = 1;
    startingLevel: number = 1;
    spdLevels: number[] = [1000, 950, 900, 850, 800, 750, 700, 650, 610, 570, 530, 490, 450, 410, 380, 350, 320, 290, 260, 230, 200, 180, 160,
                        140, 120, 100, 90, 80, 70, 60, 50, 45, 40, 35, 30];
    textNodes: Text[] = [];
    score: number = 0;
    tetrisLast: boolean = false; // To check for back-to-back tetris
    paused: boolean = true;

    constructor(lvl: number){
        this.level = lvl;
        this.startingLevel = lvl;
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
            if(Date.now() - t > this.spdLevels[this.level-1]){
                if(!this.boardCollision("down")){
                    this.activeBlock.res.y += blockSize;
                }else{
                    this.stopActive();
                }
                t = new Date().getTime();
            }
        })

        this.boardTicker.start();
        this.paused = false;
    }

    createBoard(){
        this.bSprite.height = 20 * blockSize;
        this.bSprite.width = 10 * blockSize;
        this.bSprite.anchor.set(0.5, 1)
        this.bSprite.position.set(window.innerWidth / 2, window.innerHeight)
        app.stage.addChild(this.bSprite);

        let next = new Graphics();
        next.beginFill(0x242424)
        next.drawRoundedRect(this.bSprite.getBounds().left - 6 * blockSize - 1/3 * blockSize, this.bSprite.getBounds().top, 6 * blockSize, 6 * blockSize, blockSize / 3)

        next.endFill();
        app.stage.addChild(next)

        let stats = new Graphics();
        stats.beginFill(0x242424);
        if(window.innerWidth > window.innerHeight){
            stats.drawRoundedRect(this.bSprite.getBounds().right + 1/3 * blockSize, this.bSprite.getBounds().top, 10 * blockSize, 11/2 * blockSize, blockSize / 3)
        }else{
            stats.drawRoundedRect(window.innerWidth / 2 - 5 * blockSize, 0, 10 * blockSize, 11/2 * blockSize, blockSize / 3)
        }

        stats.endFill();
        app.stage.addChild(stats)

        let midx = stats.getBounds().x + stats.getBounds().width / 2;

        let lvlLabel = new Text('Level',{
            fontFamily: 'Lucida Console',
            fontSize: blockSize / 2,
            fill: [0xFFFFFF, 0xA0A0A0]
        })
        lvlLabel.anchor.set(0.5, 0)
        if(window.innerWidth > window.innerHeight){
            lvlLabel.position.set(midx, this.bSprite.getBounds().top + blockSize / 3);
        }else{
            lvlLabel.position.set(midx, stats.getBounds().top + blockSize / 3);
        }
        app.stage.addChild(lvlLabel);

        let lvl = new Text('1',{
            fontFamily: 'Lucida Console',
            fontSize: blockSize,
            fill: [0xFFFFFF, 0xA0A0A0]
        })
        lvl.anchor.set(0.5, 0)
        lvl.position.set(midx, lvlLabel.getBounds().bottom);
        app.stage.addChild(lvl);
        this.textNodes[0] = lvl;

        let linesLabel = new Text('Lines cleared',{
            fontFamily: 'Lucida Console',
            fontSize: blockSize / 2,
            fill: [0xFFFFFF, 0xA0A0A0]
        })
        linesLabel.anchor.set(0.5, 0)
        linesLabel.position.set(midx, lvl.getBounds().bottom + blockSize / 3)
        app.stage.addChild(linesLabel)

        let lines = new Text('0',{
            fontFamily: 'Lucida Console',
            fontSize: blockSize,
            fill: [0xFFFFFF, 0xA0A0A0]
        })
        this.textNodes[1] = lines;
        lines.anchor.set(0.5, 0)
        lines.position.set(midx, linesLabel.getBounds().bottom);
        app.stage.addChild(lines);

        let scoreLabel  = new Text('Score',{
            fontFamily: 'Lucida Console',
            fontSize: blockSize / 2,
            fill: [0xFFFFFF, 0xA0A0A0]
        })
        scoreLabel.anchor.set(0.5, 0);
        scoreLabel.position.set(midx, lines.getBounds().bottom + blockSize / 3);
        app.stage.addChild(scoreLabel)

        let score = new Text('0',{
            fontFamily: 'Lucida Console',
            fontSize: blockSize,
            fill: [0xFFFFFF, 0xA0A0A0]
        })
        this.textNodes[2] = score;
        score.anchor.set(0.5, 0);
        score.position.set(midx, scoreLabel.getBounds().bottom);
        app.stage.addChild(score);
    }

    clearBoard(){
        app.stage.children.forEach(el => {
            if(app.stage.children.indexOf(el) != 0){
                el.destroy();
            }
        })
        this.boardTicker.destroy();
        if(this.textNodes[0].transform !== null){
            this.textNodes[0].destroy()
        }
        if(this.textNodes[1].transform !== null){
            this.textNodes[1].destroy()
        }
        if(this.textNodes[2].transform !== null){
            this.textNodes[2].destroy()
        }
    }

    pause(){
        if(this.boardTicker.started){
            this.boardTicker.stop()
            pause();
            this.playing = false;
        }else{
            this.boardTicker.start();
            unpause();
            this.playing = true;
        }
    }

    end(){
        this.boardTicker.stop();
        this.playing = false;
        endScreen();
    }

    levelCheck(){
        if(this.linesDestroyed > 0 && this.level <= this.spdLevels.length && this.startingLevel + Math.floor(this.linesDestroyed / 10) != this.level){
            this.level = this.startingLevel + Math.floor(this.linesDestroyed / 10);
        }
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

    lineCheck(){
        let linesDestroyedNow: number = 0;
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
                        linesDestroyedNow++;
                        this.linesDestroyed++;
                    }
                }
            }
        }
        if(linesDestroyedNow > 0){
            this.addScore(linesDestroyedNow);
        }
        if(linesDestroyedNow == 4){
            this.tetrisLast = true;
        }else{
            this.tetrisLast = false;
        }
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

    positionBlocks(){
        this.activeBlock.res.x = (this.bSprite.getBounds().left + 6 * blockSize - this.activeBlock.res.width);
        this.activeBlock.res.y = (this.bSprite.getBounds().top - this.activeBlock.res.height + blockSize);

        this.nextBlock.res.y = this.bSprite.getBounds().top + (6 * blockSize - this.nextBlock.res.height) / 2;
        this.nextBlock.res.x = this.bSprite.getBounds().left - (6 * blockSize + this.nextBlock.res.width) / 2;
    }

    hardDrop(){
        let blocks = 0;
        while(!this.boardCollision("down")){
            this.activeBlock.res.y += blockSize;
            blocks++;
        }
        this.addScore(0, blocks);
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
                        this.addScore(0, 1);
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
                case " ": {
                    this.hardDrop();
                    break;
                }
                case "Escape": {
                    this.pause();
                    break;
                }
            }
        }
    }

    handleText(){
        this.textNodes[0].text = (this.level).toString();
        this.textNodes[1].text = (this.linesDestroyed).toString();
        this.textNodes[2].text = (this.score).toString();
    }

    addScore(ld: number, linesDropped?: number){ //ld - lines destroyed, soft - for drops soft/hard
        switch (ld) {
            case 0:
                if(linesDropped == 1){
                    this.score += this.level;   
                }else{
                    if(linesDropped){
                        this.score += linesDropped * this.level * 2;
                    }
                }
                break;
            case 1:
                this.score += 100 * this.level;
                break;
            case 2:
                this.score += 300 * this.level;
                break;
            case 3:
                this.score += 500 * this.level;
                break;
            case 4:
                this.score += 800 * this.level * (this.tetrisLast ? 1.5 : 1); // 1.5 multi for back-to-back
                break;
            default: 
                break;
        }
        this.handleText();
    }
}