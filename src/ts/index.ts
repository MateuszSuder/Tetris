import {Application, Container, Sprite, Filter, filters} from 'pixi.js-legacy'
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
app.loader.load();

let blocks: Container[];
export let blockSize: number;

function loadingDone(){
    blockSize = window.innerHeight / 25;

    let bg = Sprite.from(app.loader.resources['bg'].texture);
    resizeBackground(bg);
    app.stage.addChild(bg);

    new Board();

    window.onresize = () => {
        resizeBackground(bg);
    }
}

function resizeBackground(bg: Sprite){
    let scale: number = window.innerWidth > window.innerHeight ? bg.width / bg.height : bg.height / bg.width

    if(window.innerWidth > window.innerHeight){
        bg.height = window.innerHeight;
        bg.width = window.innerHeight * scale;
    }else{
        bg.height = window.innerWidth * scale;
        bg.width = window.innerWidth;
    }

    bg.anchor.set(0.5, 1);
    bg.position.set(window.innerWidth / 2, window.innerHeight);
    const blur = new filters.BlurFilter()
    blur.blur = 5;
    bg.filters = [blur];
}