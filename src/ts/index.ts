import {Application, Sprite, filters} from 'pixi.js-legacy'
import { isForInStatement, isUnparsedSource } from '../../node_modules/typescript/lib/typescript';
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
    document.getElementById("loading-bar-inner")!.style.width = (Math.round(e.progress)) + '%';
}

export function setSize(){
    if(window.innerWidth > window.innerHeight){
        blockSize = window.innerHeight / 25;
    }else{
        blockSize = window.innerHeight / 35;
    }
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
    manageLeaderboard();
    document.getElementById("options")!.style.display = "grid";
}

export function sendScore(){
    let n = (<HTMLInputElement>document.getElementById("name")!).value;
    let lv = board.level;
    let l = board.linesDestroyed;
    let s = board.score;
    const result = {
        name: n,
        level: lv,
        lines: l,
        score: s
    }
    window.localStorage.setItem(window.localStorage.length.toString(), JSON.stringify(result))
}

function manageLeaderboard(){
    let body = document.getElementById("body");
    body!.innerHTML = '';
    let scores = [];
    for(let i = 0; i < window.localStorage.length; i++){
        let item = localStorage.getItem(i.toString())
        let parsed = item !== null ? JSON.parse(item) : '';
        scores.push(parsed);
    }
    let sortable = [];
    for(let it of scores){
        sortable.push([scores.indexOf(it), it.score, it.level, it.lines])
    }
    sortable.sort(function(a,b){
        if(a[1] == b[1]){
            if(b[2] == a[2]){
                return b[3] - b[3]
            }else{
                return b[2] - a[2];
            }
        }else{
            return b[1] - a[1];
        }
    })

    for(let i = 0; i < sortable.length; i++){
        if(i == 10){
            break;
        }
        let node = document.createElement('div');

        let nr = document.createElement('div');
        nr.innerText = (i+1).toString();
        nr.classList.add('cell');

        let name = document.createElement('div');
        name.innerText = scores[sortable[i][0]].name;
        name.classList.add('cell');

        let level = document.createElement('div');
        level.innerText = scores[sortable[i][0]].level;
        level.classList.add('cell');

        let lines = document.createElement('div');
        lines.innerText = scores[sortable[i][0]].lines;
        lines.classList.add('cell');

        let score = document.createElement('div');
        score.innerText = scores[sortable[i][0]].score;
        score.classList.add('cell');

        node.appendChild(nr)
        node.appendChild(name)
        node.appendChild(level)
        node.appendChild(lines)
        node.appendChild(score)
        
        body?.appendChild(node)
    }
}  

export function pause(){
    let pause = document.createElement('div');
    pause.id = 'pause';
    let pauseInner = document.createElement('div');
    pauseInner.classList.add('inner');

    let textNode = document.createElement('p')
    let text = document.createTextNode('Pause');
    textNode.appendChild(text);

    let resNode = document.createElement('p')
    let res = document.createTextNode('Resume');
    resNode.appendChild(res);
    resNode.addEventListener('click', () => {
        board.pause();
    })

    let ngNode = document.createElement('p')
    let ng = document.createTextNode('New game');
    ngNode.appendChild(ng);
    ngNode.addEventListener('click', () => {
        unpause();
        start();
    }) 

    pauseInner.appendChild(textNode);
    pauseInner.appendChild(resNode);
    pauseInner.appendChild(ngNode);

    pause.appendChild(pauseInner)

    document.body.appendChild(pause)
}

export function unpause(){
    document.getElementById('pause')?.remove();
}

export function endScreen(){
    if(document.querySelector("#end") == null){
        let end = document.createElement('div');
        end.id = 'end';

        let inner = document.createElement('div');
        inner.classList.add('inner');

        let goNode = document.createElement('p');
        let go = document.createTextNode('Game over');
        goNode.appendChild(go);

        let nameNode = document.createElement('div');
        nameNode.classList.add('flexCol')
        let name = document.createTextNode('Your name:');
        let nameInput = document.createElement('input');
        nameInput.type = "text";
        nameInput.id = "name";
        nameInput.maxLength = 8;

        let submit = document.createElement('div');
        submit.classList.add('confirm');
        submit.id = "submit";
        submit.textContent = "Save score!"

        nameNode.appendChild(name);
        nameNode.appendChild(nameInput);
        nameNode.appendChild(submit);

        end.appendChild(inner);
        inner.appendChild(goNode);
        inner.appendChild(nameNode);

        document.body.appendChild(end)

        document.querySelector('#submit')?.addEventListener('click', () => {
            sendScore();
            end.remove();
            start();
        })
    }
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
    setSize();
    document.getElementById("start")!.style.display = "block";

    document.querySelector("#start")?.addEventListener('click', () => {
        start();
    })    

    let bg = Sprite.from(app.loader.resources['bg'].texture);
    app.stage.addChild(bg);
    resizeBackground(bg);
    const blur = new filters.BlurFilter()
    blur.blur = 5;
    bg.filters = [blur];


    window.onresize = () => {
        console.log('rs')
        resizeBackground(bg);
    }
}



function resizeBackground(bg: Sprite){
    let scale: number = app.loader.resources['bg'].texture.width / app.loader.resources['bg'].texture.height;

    app.renderer.view.style.width = window.innerWidth + 'px';
    app.renderer.view.style.height = window.innerHeight + 'px';

    bg.height = window.innerHeight;
    bg.width = window.innerHeight * scale;

    bg.anchor.set(0.5, 1);
    bg.position.set(window.innerWidth / 2, window.innerHeight);
}