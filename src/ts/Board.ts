import { Sprite, Container, Ticker, DisplayObject, Graphics } from "pixi.js-legacy";
import {app, blockSize} from "./index"
import {randomInt} from "./functions"
import {Block} from "./Block"
 
export class Board {
    board: Sprite[] = [];
    activeBlock: Block;
    nextBlock: Block;
    bSprite: Sprite = Sprite.from(app.loader.resources['back'].texture);
    constructor(){
        this.createBoard();

        this.activeBlock = new Block(3);
        this.nextBlock = new Block(randomInt(1,7));

        app.stage.addChild(this.activeBlock.res);
        this.activeBlock.res.x = (this.bSprite.getBounds().left + 3 * blockSize);
        this.activeBlock.res.y = (this.bSprite.getBounds().top + 4 * blockSize);

        window.addEventListener('keydown', (e) => {
            this.handleKey(e);
        })
    }

    handleKey(e: KeyboardEvent){
        switch (e.key){
            case "ArrowUp": {
                this.activeBlock.changeState(this.activeBlock.res.getBounds().left - this.bSprite.getBounds().left, 
                this.bSprite.getBounds().bottom - this.activeBlock.res.getBounds().bottom
                ,this.board, true);
            }
            break;
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

    boardCollision(direction: string){
        switch (direction) {
            case "down": {
                if(this.activeBlock.res.getBounds().bottom == this.bSprite.getBounds().bottom){
                    return true;
                }
                break;
            }
            case "left": {
                if(this.activeBlock.res.getBounds().left - blockSize / 2 < this.bSprite.getBounds().left){
                    return true;
                }
                break;
            }
            case "right": {
                if(this.activeBlock.res.getBounds().right + blockSize / 2 > this.bSprite.getBounds().right){
                    return true;
                }
                break;
            }
        }
    }

    createBoard(){
        this.bSprite.height = 20 * blockSize;
        this.bSprite.width = 10 * blockSize;
        this.bSprite.anchor.set(0.5, 1)
        this.bSprite.position.set(window.innerWidth / 2, window.innerHeight)
        app.stage.addChild(this.bSprite);
    }
}