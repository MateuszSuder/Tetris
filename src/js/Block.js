import { Container, Sprite } from "pixi.js-legacy";
import { app, blockSize } from "./index";
export class Block {
    constructor(bnr) {
        this.state = 1;
        this.res = new Container();
        this.blockNumber = bnr;
        this.tex = app.loader.resources['b' + bnr].texture;
        this.createBlock();
    }
    // Creates block from texture
    createBlock() {
        switch (this.blockNumber) {
            case 1: {
                for (let i = 0; i < 4; i++) {
                    let sprite = Sprite.from(this.tex);
                    sprite.width = sprite.height = blockSize;
                    sprite.y = blockSize * i;
                    this.res.addChild(sprite);
                }
                break;
            }
            case 2: {
                for (let i = 0; i < 4; i++) {
                    let sprite = Sprite.from(this.tex);
                    sprite.width = sprite.height = blockSize;
                    if (i == 0 || i == 1) {
                        sprite.x = blockSize * i;
                    }
                    else {
                        sprite.x = blockSize * (i % 2);
                        sprite.y = blockSize;
                    }
                    this.res.addChild(sprite);
                }
                break;
            }
            case 3: {
                for (let i = 0; i < 4; i++) {
                    let sprite = Sprite.from(this.tex);
                    sprite.width = sprite.height = blockSize;
                    if (i < 2) {
                        sprite.y = blockSize * i;
                    }
                    else {
                        sprite.y = blockSize;
                        sprite.x = blockSize * (i - 1);
                    }
                    this.res.addChild(sprite);
                }
                break;
            }
            case 4: {
                for (let i = 0; i < 4; i++) {
                    let sprite = Sprite.from(this.tex);
                    sprite.width = sprite.height = blockSize;
                    if (i == 0) {
                        sprite.y = blockSize;
                    }
                    else {
                        sprite.y = (i - 1) * blockSize;
                        sprite.x = blockSize;
                    }
                    this.res.addChild(sprite);
                }
                break;
            }
            case 5: {
                for (let i = 0; i < 4; i++) {
                    let sprite = Sprite.from(this.tex);
                    sprite.width = sprite.height = blockSize;
                    if (i < 2) {
                        sprite.x = blockSize * i;
                        sprite.y = blockSize;
                    }
                    else {
                        sprite.x = blockSize * (i - 1);
                    }
                    this.res.addChild(sprite);
                }
                break;
            }
            case 6: {
                for (let i = 0; i < 4; i++) {
                    let sprite = Sprite.from(this.tex);
                    sprite.width = sprite.height = blockSize;
                    if (i < 3) {
                        sprite.x = blockSize * i;
                        sprite.y = blockSize;
                    }
                    else {
                        sprite.x = blockSize * (i - 1);
                    }
                    this.res.addChild(sprite);
                }
                break;
            }
            case 7: {
                for (let i = 0; i < 4; i++) {
                    let sprite = Sprite.from(this.tex);
                    sprite.width = sprite.height = blockSize;
                    if (i < 2) {
                        sprite.x = blockSize * i;
                    }
                    else {
                        sprite.x = blockSize * (i - 1);
                        sprite.y = blockSize;
                    }
                    this.res.addChild(sprite);
                }
                break;
            }
        }
    }
    check(b) {
        let copy = Object.assign({}, this); // Object copy to calculate from
    }
    // Changes state of block, rotates it
    changeState(leftBoarderDistance, downDistance, board, next) {
        this.check(board);
        let distanceB = Math.round(downDistance / blockSize); // Distance in blocks to bottom border
        let distance = (Math.round(leftBoarderDistance / blockSize)); // Distance in blocks to left border
        switch (this.blockNumber) { // Switch depending on block
            case 1: {
                switch (this.state) { //Check state
                    case 1: {
                        if (distance < 5) {
                            for (let i = 0; i < this.res.children.length; i++) {
                                this.res.children[i].y = 3 * blockSize;
                                this.res.children[i].x = (i) * blockSize;
                            }
                        }
                        else {
                            for (let i = 0; i < this.res.children.length; i++) {
                                this.res.children[i].y = 3 * blockSize;
                                this.res.children[i].x = (i - 3) * blockSize;
                            }
                        }
                        this.state = 2;
                        break;
                    }
                    case 2: {
                        if (distance < 5) {
                            for (let i = 0; i < this.res.children.length; i++) {
                                this.res.children[i].x = 0;
                                this.res.children[i].y = blockSize * i;
                            }
                        }
                        else {
                            for (let i = 0; i < this.res.children.length; i++) {
                                this.res.children[i].x = 0;
                                this.res.children[i].y = blockSize * i;
                            }
                        }
                        this.state = 1;
                        break;
                    }
                }
            }
            case 2: {
                break;
            }
            case 3: {
                let state = this.state;
                if (next) {
                    if (this.state == 4) {
                        state = 1;
                    }
                    else {
                        state++;
                    }
                }
                else {
                    if (this.state == 1) {
                        state = 4;
                    }
                    else {
                        state--;
                    }
                }
                console.log("state: " + state);
                console.log("distance: " + distance);
                switch (state) {
                    case 1: {
                        for (let i = 0; i < this.res.children.length; i++) {
                            if (i < 2) {
                                this.res.children[i].y = blockSize * i;
                                this.res.children[i].x = 0;
                            }
                            else {
                                this.res.children[i].y = blockSize;
                                this.res.children[i].x = blockSize * (i - 1);
                            }
                        }
                        this.res.x += blockSize * (distance == 8 ? -1 : 0);
                        this.state = state;
                        break;
                    }
                    case 2: {
                        for (let i = 0; i < this.res.children.length; i++) {
                            if (i < 2) {
                                this.res.children[i].y = 0;
                                this.res.children[i].x = blockSize * (i + 1);
                            }
                            else {
                                this.res.children[i].y = blockSize * (i - 1);
                                this.res.children[i].x = blockSize;
                            }
                        }
                        this.res.y -= blockSize * (distanceB == 0 ? 1 : 0);
                        this.state = state;
                        break;
                    }
                    case 3: {
                        for (let i = 0; i < this.res.children.length; i++) {
                            if (i < 2) {
                                this.res.children[i].y = blockSize;
                                this.res.children[i].x = blockSize * i;
                            }
                            else {
                                this.res.children[i].y = blockSize * (i - 1);
                                this.res.children[i].x = blockSize * 2;
                            }
                        }
                        this.res.x += blockSize * (distance == 0 ? 1 : 0);
                        this.state = state;
                        break;
                    }
                    case 4: {
                        for (let i = 0; i < this.res.children.length; i++) {
                            if (i < 2) {
                                this.res.children[i].y = blockSize * 2;
                                this.res.children[i].x = blockSize * i;
                            }
                            else {
                                this.res.children[i].y = blockSize * (i - 2);
                                this.res.children[i].x = blockSize;
                            }
                        }
                        this.state = state;
                        break;
                    }
                }
                break;
            }
            case 4: {
                // Variable holding next/previous state, we don't want to change main variable until we change the state
                let state = this.state;
                if (next) {
                    if (this.state == 4) {
                        state = 1;
                    }
                    else {
                        state++;
                    }
                }
                else {
                    if (this.state == 1) {
                        state = 4;
                    }
                    else {
                        state--;
                    }
                }
                switch (state) {
                    case 1: {
                        for (let i = 0; i < this.res.children.length; i++) {
                            if (i == 0) {
                                this.res.children[i].y = blockSize;
                                this.res.children[i].x = 0;
                            }
                            else {
                                this.res.children[i].y = (i - 1) * blockSize;
                                this.res.children[i].x = blockSize;
                            }
                        }
                        this.res.x += blockSize * (distance == 8 ? -1 : 0);
                        this.state = state;
                        break;
                    }
                    case 2: {
                        for (let i = 0; i < this.res.children.length; i++) {
                            if (i == 0) {
                                this.res.children[i].y = 0;
                                this.res.children[i].x = blockSize;
                            }
                            else {
                                this.res.children[i].y = blockSize;
                                this.res.children[i].x = (i - 1) * blockSize;
                            }
                        }
                        this.res.x += blockSize * (distance == 8 ? -1 : 0);
                        this.state = state;
                        break;
                    }
                    case 3: {
                        for (let i = 0; i < this.res.children.length; i++) {
                            if (i == 0) {
                                this.res.children[i].y = blockSize;
                                this.res.children[i].x = 2 * blockSize;
                            }
                            else {
                                this.res.children[i].y = (i - 1) * blockSize;
                                this.res.children[i].x = blockSize;
                            }
                        }
                        this.res.x += blockSize * (distance == 8 ? -1 : 0);
                        this.res.y -= blockSize * (distanceB == 0 ? 1 : 0);
                        this.state = state;
                        break;
                    }
                    case 4: {
                        for (let i = 0; i < this.res.children.length; i++) {
                            if (i < 3) {
                                this.res.children[i].y = blockSize;
                                this.res.children[i].x = i * blockSize;
                            }
                            else {
                                this.res.children[i].y = 2 * blockSize;
                                this.res.children[i].x = blockSize;
                            }
                        }
                        this.res.x += blockSize * (distance == 0 ? 1 : 0);
                        this.state = state;
                        break;
                    }
                }
            }
        }
    }
}
