import {Application, Sprite, filters} from 'pixi.js-legacy'
import {Board} from './Board'

export const app = new Application({
    transparent: true,
    resolution: 1,
    antialias: false,
    height: window.innerHeight,
    width: window.innerWidth
})

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
.add('b7', 'block-7.webp')
app.loader.onComplete.add(loadingDone);
app.loader.onProgress.add(showProgress)
app.loader.load();

export let blockSize: number;

export let board: Board;

function showProgress(e: any){
    document.getElementById("loading-bar-inner")!.style.width = (Math.round(e.progress)/100 * 20) + 'vw';
}


export function start(){
    if(document.getElementById("loading") != null){
        document.getElementById("loading")!.remove()
        document.getElementById("plus")?.addEventListener('click', () => {
            adjustLevel(true);
        })
        document.getElementById("minus")?.addEventListener('click', () => {
            adjustLevel(false);
        })
        document.getElementById("play")?.addEventListener('click', () => {
            play();
        })
    }
    document.getElementById("options")!.style.display = "flex";
}

function play(){
    let lvl: number = parseInt(document.getElementById('level')!.textContent!);
    if(lvl > 0 && lvl <= 35){
        if(board != undefined){
            board.clearBoard();
        }
        board = new Board(lvl);
        document.getElementById("options")!.style.display = "none";
    }else{
        document.getElementById('level')!.innerText = "1";
        throw Error;
    }
    
}

function adjustLevel(plus: boolean){
    let node = document.getElementById('level');
    let lvl: number = 1;
    if(node?.textContent != null){
        lvl = parseInt(node?.textContent);
    }
    if(plus){
        node!.innerText = (lvl < 35 ? ++lvl : lvl).toString();
    }else{
        node!.innerText = (lvl > 1 ? --lvl : lvl).toString();
    }
}

function loadingDone(){
    document.getElementById("start")!.style.display = "block";

    document.querySelector("#start")?.addEventListener('click', () => {
        start();
    })

    blockSize = window.innerHeight / 25;

    let bg = Sprite.from(app.loader.resources['bg'].texture);
    resizeBackground(bg);
    const blur = new filters.BlurFilter()
    blur.blur = 5;
    bg.filters = [blur];

    app.stage.addChild(bg);

    //new Board();

    window.onresize = () => {
        resizeBackground(bg);
    }
}



function resizeBackground(bg: Sprite){
    let scale: number = bg.width / bg.height;


    bg.height = window.innerHeight;
    bg.width = window.innerHeight * scale;

    bg.anchor.set(0.5, 1);
    bg.position.set(window.innerWidth / 2, window.innerHeight);
}