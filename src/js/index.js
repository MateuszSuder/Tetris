import { Application, Sprite, filters } from 'pixi.js-legacy';
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
    .add('bg', 'background.webp')
    .add('b1', 'block-1.webp')
    .add('b2', 'block-2.webp')
    .add('b3', 'block-3.webp')
    .add('b4', 'block-4.webp')
    .add('b5', 'block-5.webp')
    .add('b6', 'block-6.webp')
    .add('b7', 'block-7.webp');
app.loader.onComplete.add(loadingDone);
app.loader.onProgress.add(showProgress);
app.loader.load();
export let blockSize;
export let board;
function showProgress(e) {
    document.getElementById("loading-bar-inner").style.width = (Math.round(e.progress) / 100 * 20) + 'vw';
}
export function start() {
    var _a, _b, _c;
    if (document.getElementById("loading") != null) {
        document.getElementById("loading").remove();
        (_a = document.getElementById("plus")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            adjustLevel(true);
        });
        (_b = document.getElementById("minus")) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
            adjustLevel(false);
        });
        (_c = document.getElementById("play")) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
            play();
        });
    }
    document.getElementById("options").style.display = "flex";
}
function play() {
    let lvl = parseInt(document.getElementById('level').textContent);
    if (lvl > 0 && lvl <= 35) {
        if (board != undefined) {
            board.clearBoard();
        }
        board = new Board(lvl);
        document.getElementById("options").style.display = "none";
    }
    else {
        document.getElementById('level').innerText = "1";
        throw Error;
    }
}
function adjustLevel(plus) {
    let node = document.getElementById('level');
    let lvl = 1;
    if ((node === null || node === void 0 ? void 0 : node.textContent) != null) {
        lvl = parseInt(node === null || node === void 0 ? void 0 : node.textContent);
    }
    if (plus) {
        node.innerText = (lvl < 35 ? ++lvl : lvl).toString();
    }
    else {
        node.innerText = (lvl > 1 ? --lvl : lvl).toString();
    }
}
function loadingDone() {
    var _a;
    document.getElementById("start").style.display = "block";
    (_a = document.querySelector("#start")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        start();
    });
    blockSize = window.innerHeight / 25;
    let bg = Sprite.from(app.loader.resources['bg'].texture);
    resizeBackground(bg);
    const blur = new filters.BlurFilter();
    blur.blur = 5;
    bg.filters = [blur];
    app.stage.addChild(bg);
    //new Board();
    window.onresize = () => {
        resizeBackground(bg);
    };
}
function resizeBackground(bg) {
    let scale = bg.width / bg.height;
    bg.height = window.innerHeight;
    bg.width = window.innerHeight * scale;
    bg.anchor.set(0.5, 1);
    bg.position.set(window.innerWidth / 2, window.innerHeight);
}
