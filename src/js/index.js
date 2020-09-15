import { Application, Container, Sprite } from 'pixi.js-legacy';
import { Board } from './Board';
export var app = new Application({
    transparent: true,
    resolution: 1,
    antialias: false,
    height: window.innerHeight,
    width: window.innerWidth
});
document.body.appendChild(app.view);
app.loader.baseUrl = 'src/img/webp/';
app.loader
    .add('back', 'game-back.webp')
    .add('b1', 'block-1.webp')
    .add('b2', 'block-2.webp')
    .add('b3', 'block-3.webp')
    .add('b4', 'block-4.webp')
    .add('b5', 'block-5.webp')
    .add('b6', 'block-6.webp')
    .add('b7', 'block-7.webp');
app.loader.onComplete.add(loadingDone);
app.loader.load();
var blocks;
export var blockSize;
function loadingDone() {
    blockSize = window.innerHeight / 25;
    new Board();
}
export function drawBlock(size, blockNumber) {
    var block = new Container();
    switch (blockNumber) {
        case 1:
            // Block 1
            block = new Container();
            for (var i = 0; i < 4; i++) {
                var sprite = Sprite.from(app.loader.resources['b1'].texture);
                sprite.width = sprite.height = size;
                sprite.y = size * i;
                block.addChild(sprite);
            }
            block.pivot.set(blockSize, blockSize * 4);
            return block;
        case 2:
            // Block 2
            block = new Container();
            for (var i = 0; i < 4; i++) {
                var sprite = Sprite.from(app.loader.resources['b2'].texture);
                sprite.width = sprite.height = size;
                if (i == 2 || i == 3) {
                    sprite.x = size;
                }
                if (i == 1 || i == 3) {
                    sprite.y = size;
                }
                block.addChild(sprite);
            }
            block.pivot.set(block.width / 2, block.height / 2);
            return block;
        case 3:
            // Block 3
            block = new Container();
            for (var i = 0; i < 4; i++) {
                var sprite = Sprite.from(app.loader.resources['b3'].texture);
                sprite.width = sprite.height = size;
                if (i > 0) {
                    sprite.y = size;
                    sprite.x = size * (i - 1);
                }
                block.addChild(sprite);
            }
            return block;
        case 4:
            // Block 4
            block = new Container();
            for (var i = 0; i < 4; i++) {
                var sprite = Sprite.from(app.loader.resources['b4'].texture);
                sprite.width = sprite.height = size;
                if (i > 0) {
                    sprite.x = size;
                    sprite.y = size * (i - 1);
                }
                else {
                    sprite.y = size;
                }
                block.addChild(sprite);
            }
            return block;
        case 5:
            // Block 5
            block = new Container();
            for (var i = 0; i < 4; i++) {
                var sprite = Sprite.from(app.loader.resources['b5'].texture);
                sprite.width = sprite.height = size;
                if (i < 2) {
                    sprite.x = size * i;
                    sprite.y = size;
                }
                else {
                    sprite.x = size * (i - 1);
                }
                block.addChild(sprite);
            }
            return block;
        case 6:
            // Block 6
            block = new Container();
            for (var i = 0; i < 4; i++) {
                var sprite = Sprite.from(app.loader.resources['b6'].texture);
                sprite.width = sprite.height = size;
                if (i < 2) {
                    sprite.x = size * i;
                }
                else {
                    sprite.x = size * (i - 1);
                    sprite.y = size;
                }
                block.addChild(sprite);
            }
            return block;
        case 7:
            // Block 7
            block = new Container();
            for (var i = 0; i < 4; i++) {
                var sprite = Sprite.from(app.loader.resources['b7'].texture);
                sprite.width = sprite.height = size;
                if (i != 3) {
                    sprite.x = size * i;
                    sprite.y = size;
                }
                else {
                    sprite.x = size * 2;
                }
                block.addChild(sprite);
            }
            return block;
    }
    return block;
}
