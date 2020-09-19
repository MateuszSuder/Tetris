import { Application } from 'pixi.js-legacy';
import { Board } from './Board';
export const app = new Application({
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
let blocks;
export let blockSize;
function loadingDone() {
    blockSize = window.innerHeight / 25;
    new Board();
}
