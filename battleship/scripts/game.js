"use strict";

let player = {
    fields: [
        Array.from(document.getElementById('r1').getElementsByTagName('td')),
        Array.from(document.getElementById('r2').getElementsByTagName('td')),
        Array.from(document.getElementById('r3').getElementsByTagName('td')),
        Array.from(document.getElementById('r4').getElementsByTagName('td')),
        Array.from(document.getElementById('r5').getElementsByTagName('td')),
        Array.from(document.getElementById('r6').getElementsByTagName('td')),
        Array.from(document.getElementById('r7').getElementsByTagName('td')),
        Array.from(document.getElementById('r8').getElementsByTagName('td')),
        Array.from(document.getElementById('r9').getElementsByTagName('td')),
        Array.from(document.getElementById('r10').getElementsByTagName('td'))
        
    ],
    ships: [4,3,2,1],

    hasShips: function(){
        if(this.ships[0]==0 && this.ships[1]==0 && this.ships[2]==0 && this.ships[3]==0) return false;
        return true;
    },
    fleet: [],
    mapOfXes: new Map()
};

let AI = {
    fields: [
        Array.from(document.getElementById('a1').getElementsByTagName('td')),
        Array.from(document.getElementById('a2').getElementsByTagName('td')),
        Array.from(document.getElementById('a3').getElementsByTagName('td')),
        Array.from(document.getElementById('a4').getElementsByTagName('td')),
        Array.from(document.getElementById('a5').getElementsByTagName('td')),
        Array.from(document.getElementById('a6').getElementsByTagName('td')),
        Array.from(document.getElementById('a7').getElementsByTagName('td')),
        Array.from(document.getElementById('a8').getElementsByTagName('td')),
        Array.from(document.getElementById('a9').getElementsByTagName('td')),
        Array.from(document.getElementById('a10').getElementsByTagName('td'))
        
    ],
    last: null,
    turn: false,
    fleet: [],
    mapOfXes: new Map(),
    hit: false
};
let freeFields = [];
for(let el of player.fields){
    freeFields.push([]);
    for(let l of el){
        freeFields[freeFields.length-1].push(l);
    }
}
let shiplen=4;
let direction = true;
let name=0;
let parentInd=0;
let oname = 0;
let oparentInd = 0;

let bt1 = document.getElementById('bt1');
let bt2 = document.getElementById('bt2');
let bt3 = document.getElementById('bt3');
let bt4 = document.getElementById('bt4'); 
let btr = document.getElementById('btr');
let txt1 = document.getElementById('txt1');
let txt2 = document.getElementById('txt2');
let txt3 = document.getElementById('txt3');
let txt4 = document.getElementById('txt4');
let txtArea = document.getElementById('txtArea');

txt1.innerText = 4;
txt2.innerText = 3;
txt3.innerText = 2;
txt4.innerText = 1;

bt1.addEventListener('click',()=> shiplen=1);
bt2.addEventListener('click',()=> shiplen=2);
bt3.addEventListener('click',()=> shiplen=3);
bt4.addEventListener('click',()=> shiplen=4);
btr.addEventListener('click',()=>direction=!direction);

for(let el of player.fields){
    let count = 0;
    for(let l of el){
        l.setAttribute('name',count++);
        l.addEventListener('mouseenter',highlightShip);
        l.addEventListener('mouseleave',unhighlightShip);
        l.addEventListener('click',placeShip);
    }
}

function highlightShip(){
    let back = Math.trunc(shiplen/2);
    let front = shiplen - back - 1;
    let mark = [];
    let color='hoverFree';
    let name = parseInt(this.attributes['name'].value);
    let parentInd = parseInt(this.parentElement.attributes['name'].value);
    if(direction){
        if(name-back<0 || name+front>9 || !isFreeShip(back,front,name,parentInd,direction,player) ||
        player.ships[shiplen-1]==0) color = 'hoverFull';
        for(let i=name-back;i<=name+front;i++){
            if(i<0 || i>9) continue;
            player.fields[parentInd][i].classList.add(color);
        }
        
    }
    else {
        if(parentInd+back>9 || parentInd-front<0 || 
            !isFreeShip(back,front,name,parentInd,direction,player) ||
        player.ships[shiplen-1]==0) color = 'hoverFull';
        for(let i=parentInd-front;i<parentInd+back+1;i++){
            if(i<0 || i>9) continue;
            mark.push(player.fields[i][name]);
        }
    }
    for(let k of mark) k.classList.add(color);
}

function unhighlightShip(){
    let back = Math.trunc(shiplen/2);
    let front = shiplen - back - 1;
    let mark = [];
    let name = parseInt(this.attributes['name'].value);
    let parentInd = parseInt(this.parentElement.attributes['name'].value);
    if(direction){
        for(let i=name-back;i<=name+front;i++){
            if(i<0 || i>9) continue;
            mark.push(player.fields[parentInd][i]);
        }
        
    }
    else {
        for(let i=parentInd-front;i<parentInd+back+1;i++){
            if(i<0 || i>9) continue;
            mark.push(player.fields[i][name]);
        }
    }
    for(let k of mark) k.classList.remove('hoverFree','hoverFull');
}

function isFreeShip(back,front,name,parentInd,direction,who){
    if(direction){
        for(let i=name-back-1; i<front+name+2;i++){
            if(i<0||i>9) continue;
            if(isShipHere(who,who.fields[parentInd][i])) return false;
        }
    }
    else{
        for(let i=parentInd-front-1;i<parentInd+back+2;i++){
            if(i<0||i>9) continue;
            if(isShipHere(who,who.fields[i][name])) return false;
        }
    }
    if(!CircleFree(back,front,name,parentInd,direction,who)) return false;
    return true;
}

function CircleFree(back,front,name,parentInd,direction,who){
    
    if(direction){
        for(let i=name-back-1;i<front+name+2;i++){
            if(i<0 || i>9) continue;
            if(parentInd-1>=0 && isShipHere(who,who.fields[parentInd-1][i])) return false;
            if(parentInd+1<=9 && isShipHere(who,who.fields[parentInd+1][i])) return false;
        }
    }
    else{
        for(let i=parentInd-front-1;i<parentInd+back+2;i++){
            if(i<0 || i>9) continue;
            if(name-1>=0 && isShipHere(who,who.fields[i][name-1])) return false;
            if(name+1<=9 && isShipHere(who,who.fields[i][name+1])) return false;
        }
    }
    return true;
}

function isShipHere(who,element){
    for(let el of who.fleet) if(el.has(element)) return true;
    return false;
}

function placeShip(){
    if(player.ships[shiplen-1]==0) return;
    let back = Math.trunc(shiplen/2);
    let front = shiplen - back - 1;
    let mark = [];
    let xes = [];
    let name = parseInt(this.attributes['name'].value);
    let parentInd = parseInt(this.parentElement.attributes['name'].value);
    if(direction){
        if(name-back>=0 && name+front<=9 && isFreeShip(back,front,name,parentInd,direction,player)){
            for(let i=name-back;i<=name+front;i++){
                mark.push(player.fields[parentInd][i]);
                if(parentInd-1>=0) xes.push(player.fields[parentInd-1][i]);
                if(parentInd+1<=9) xes.push(player.fields[parentInd+1][i]);
            }
            if(name-back-1>=0){
                xes.push(player.fields[parentInd][name-back-1]);
                if(parentInd-1>=0) xes.push(player.fields[parentInd-1][name-back-1]);
                if(parentInd+1<=9) xes.push(player.fields[parentInd+1][name-back-1]);
            }
            if(name+front+1<=9){
            xes.push(player.fields[parentInd][name+front+1]);
            if(parentInd-1>=0) xes.push(player.fields[parentInd-1][name+front+1]);
            if(parentInd+1<=9) xes.push(player.fields[parentInd+1][name+front+1]);
            } 
        }
    } 
    else {
        if(parentInd-front>=0 && parentInd+back<=9 && 
            isFreeShip(back,front,name,parentInd,direction,player)){
            for(let i=parentInd-front;i<parentInd+back+1;i++){
                mark.push(player.fields[i][name]);
                if(name-1>=0) xes.push(player.fields[i][name-1]);
                if(name+1<=9) xes.push(player.fields[i][name+1]);
            }
            if(parentInd-front-1>=0){
                xes.push(player.fields[parentInd-front-1][name]);
                if(name-1>=0) xes.push(player.fields[parentInd-front-1][name-1]);
                if(name+1<=9) xes.push(player.fields[parentInd-front-1][name+1]);
            }
            if(parentInd+back+1<=9){
                xes.push(player.fields[parentInd+back+1][name]);
                if(name-1>=0) xes.push(player.fields[parentInd+back+1][name-1]);
                if(name+1<=9) xes.push(player.fields[parentInd+back+1][name+1]);
            }
        }
        
    }
    for(let m of mark){
        
        m.innerHTML='&#9898';
        
    }

    if(mark.length!=0){
        switch(shiplen){
            case 4:
            txt4.innerText = --player.ships[3];
            break;
            case 3:
            txt3.innerText = --player.ships[2];
            break;
            case 2:
            txt2.innerText = --player.ships[1];
            break;
            case 1:
            txt1.innerText = --player.ships[0];
            break;
        }
        
        player.fleet.push(new Set(mark));
        player.mapOfXes.set(player.fleet[player.fleet.length-1],xes);
    }

    if(!player.hasShips()) startGame();
}

function startGame(){
    txtArea.innerHTML = '<span>AIs turn...</span>';
    AI.turn = true;
    bt1.style.display='none';
    bt2.style.display='none';
    bt3.style.display='none';
    bt4.style.display='none';
    btr.style.display='none';
    for(let el of player.fields){
        for(let l of el){
            l.classList.remove('hoverFree','hoverFull');
            l.removeEventListener('mouseenter',highlightShip);
            l.removeEventListener('mouseleave',unhighlightShip);
            l.removeEventListener('click',placeShip);
        }
    }
    for(let el of AI.fields){
        let count=0;
        for(let l of el){
            l.setAttribute('name',count++);
            l.addEventListener('mouseenter',highlightAI);
            l.addEventListener('mouseleave',unhighlightAI);
            l.addEventListener('click',playerHit);
        }
    }
    setUpAIBattleships();
    setTimeout(()=>AITurn(),2000);
}

function highlightAI(){
    let color = 'hoverFree';
    if(this.innerHTML!='' || AI.turn) color = 'hoverFull';
    this.classList.add(color);
}

function unhighlightAI(){
    this.classList.remove('hoverFree','hoverFull');
}

function playerHit(){ 
    if(!AI.turn && this.innerHTML==''){
        for(let el of AI.fleet){
            if(el.has(this)){
                this.innerHTML = '&#9938';
                el.delete(this);
                if(el.size==0){
                    txtArea.innerHTML = 'Sinked!<br><br>Still your turn...';
                    putCrosses(AI,el);
                    if(gameOver(AI)) endGame(player);
                }
                else{txtArea.innerHTML = 'Hit!<br><br>Still your turn...';}
                return;
            }
        }
        txtArea.innerHTML = 'Missed!<br><br>AIs turn...';
        this.innerHTML = '&#9932';
        AI.turn = true;
        setTimeout(()=>AITurn(),2000);
    }
}

function gameOver(who){
    for(let k of who.fleet){
        if(k.size!=0) return false;
    }
    return true;
}

function putCrosses(who,element){

    let n = who.mapOfXes.get(element);

    if(who==player){
        for(let el of n) {
            el.innerHTML='&#9932';
            updateFreeFields(el);
        }
    }
    else{
        for(let el of n) {
            el.innerHTML='&#9932';
        }
    }
    
}

function setUpAIBattleships(){
    
    for(let shiplen = 4;shiplen>0;shiplen--){
        let count=1;
        switch(shiplen){
            case 4:
            count = 1;
            break;
            case 3:
            count = 2;
            break;
            case 2:
            count = 3;
            break;
            case 1:
            count = 4;
            break;
        }
        let back = Math.trunc(shiplen/2);
        let front = shiplen - back - 1;
        let name = 0;
        let parentInd = 0;
        let direction = false;

        for(;count>0;count--){
            do{
                name = Math.trunc(Math.random()*10);
                parentInd = Math.trunc(Math.random()*10);
                direction = Math.random()>0.5000000?true:false;
            }while(!isInBoundries(back,front,name,parentInd,direction) ||
             !isFreeShip(back,front,name,parentInd,direction,AI));

             placeShipAI(back,front,name,parentInd,direction);
        }
    }

}

function isInBoundries(back,front,name,parentInd,direction){
    if(direction){
        if(name-back<0 || name+front>9) return false;
    }
    else{
        if(parentInd+back>9 || parentInd-front<0) return false;
    }
    return true;
}

function placeShipAI(back,front,name,parentInd,direction){
    let mark=[];
    let xes=[];
    if(direction){
        for(let i=name-back;i<=name+front;i++){
            mark.push(AI.fields[parentInd][i]);
            if(parentInd-1>=0) xes.push(AI.fields[parentInd-1][i]);
            if(parentInd+1<=9) xes.push(AI.fields[parentInd+1][i]);
        } 
        if(name-back-1>=0){
            xes.push(AI.fields[parentInd][name-back-1]);
            if(parentInd-1>=0) xes.push(AI.fields[parentInd-1][name-back-1]);
            if(parentInd+1<=9) xes.push(AI.fields[parentInd+1][name-back-1]);
        } 
        if(name+front+1<=9){
            xes.push(AI.fields[parentInd][name+front+1]);
            if(parentInd-1>=0) xes.push(AI.fields[parentInd-1][name+front+1]);
            if(parentInd+1<=9) xes.push(AI.fields[parentInd+1][name+front+1]);
        } 
    } 
    else{
        for(let i=parentInd-front;i<=parentInd+back;i++){
            mark.push(AI.fields[i][name]);
            if(name-1>=0) xes.push(AI.fields[i][name-1]);
            if(name+1<=9) xes.push(AI.fields[i][name+1]);
        }
        if(parentInd-front-1>=0){
            xes.push(AI.fields[parentInd-front-1][name]);
            if(name-1>=0) xes.push(AI.fields[parentInd-front-1][name-1]);
            if(name+1<=9) xes.push(AI.fields[parentInd-front-1][name+1]);
        }
        if(parentInd+back+1<=9){
            xes.push(AI.fields[parentInd+back+1][name]);
            if(name-1>=0) xes.push(AI.fields[parentInd+back+1][name-1]);
            if(name+1<=9) xes.push(AI.fields[parentInd+back+1][name+1]);
        }
    }
    AI.fleet.push(new Set(mark));
    AI.mapOfXes.set(AI.fleet[AI.fleet.length-1],xes);
}

function updateFreeFields(element){
    let name1 = 0;
    let parentInd1 = 0;
    let found = false;
    loop1:
    for(let i=0;i<freeFields.length;i++){
        for(let j=0;j<freeFields[i].length;j++){
            if(freeFields[i][j]==element){
                name1=j;
                parentInd1=i;
                found = true;
                break loop1;
            }
        }
    }
    if(found){
        freeFields[parentInd1].splice(name1,1);
        if(freeFields[parentInd1].length==0) freeFields.splice(parentInd1,1);
    }
}

function AITurn(){
    let element;
    let curHit = false;
    while(AI.turn){
        AI.turn=false;
        if(AI.last===null){
            parentInd = Math.trunc(Math.random()*freeFields.length);
            name = Math.trunc(Math.random()*freeFields[parentInd].length);
            element = freeFields[parentInd][name];
            name = parseInt(element.attributes['name'].value);
            parentInd = parseInt(element.parentElement.attributes['name'].value);
            
        }
        else{
            switch(AI.last){
                case 0:
                if(name+1<=9 &&  player.fields[parentInd][name+1].innerHTML!='⛌') element = player.fields[parentInd][name+1];
                else if(AI.hit || (name-1>=0 && player.fields[parentInd][name-1].innerHTML=='⛒')) {
                    name = oname;
                    parentInd = oparentInd;
                    AI.last = 2;
                    element = player.fields[parentInd][name-1];
                }
                else{
                    if(parentInd+1<=9 && player.fields[parentInd+1][name].innerHTML!='⛌') {
                        AI.last = 1;
                        element = player.fields[parentInd+1][name];
                    }
                    else if(name-1>=0 && player.fields[parentInd][name-1].innerHTML!='⛌') {
                        AI.last = 2;
                        element = player.fields[parentInd][name-1];
                    }
                    else {
                        AI.last = 3;
                        element = player.fields[parentInd-1][name];
                    }
                }
                break;
                case 1:
                if(parentInd+1<=9 && player.fields[parentInd+1][name].innerHTML!='⛌') element = player.fields[parentInd+1][name];
                else if(AI.hit || (parentInd-1>=0 && player.fields[parentInd-1][name].innerHTML=='⛒')) {
                    name = oname;
                    parentInd = oparentInd;
                    AI.last = 3;
                    element = player.fields[parentInd-1][name];
                }
                else{
                    if(name-1>=0 && player.fields[parentInd][name-1].innerHTML!='⛌') {
                        AI.last = 2;
                        element = player.fields[parentInd][name-1];
                    }
                    else if(parentInd-1>=0 && player.fields[parentInd-1][name].innerHTML!='⛌') {
                        AI.last = 3;
                        element = player.fields[parentInd-1][name];
                    }
                    else {
                        AI.last = 0;
                        element = player.fields[parentInd][name+1];
                    }
                }
                break;
                case 2:
                if(name-1>=0 && player.fields[parentInd][name-1].innerHTML!='⛌') element = player.fields[parentInd][name-1];
                else if(AI.hit || (name+1>=0 && player.fields[parentInd][name+1].innerHTML=='⛒')) {
                    name = oname;
                    parentInd = oparentInd;
                    AI.last = 0;
                    element = player.fields[parentInd][name+1];
                }
                else{
                    if(parentInd-1>=0 && player.fields[parentInd-1][name].innerHTML!='⛌') {
                        AI.last = 3;
                        element = player.fields[parentInd-1][name];
                    }
                    else if(name+1<=9 && player.fields[parentInd][name+1].innerHTML!='⛌') {
                        AI.last = 0;
                        element = player.fields[parentInd][name+1];
                    }
                    else {
                        AI.last = 1;
                        element = player.fields[parentInd+1][name];
                    }
                }
                break;
                case 3:
                if(parentInd-1>=0 && player.fields[parentInd-1][name].innerHTML!='⛌') element = player.fields[parentInd-1][name];
                else if(AI.hit || (parentInd+1>=0 && player.fields[parentInd+1][name].innerHTML=='⛒')) {
                    name = oname;
                    parentInd = oparentInd;
                    AI.last = 1;
                    element = player.fields[parentInd+1][name];
                }
                else{
                    if(name+1<=9 && player.fields[parentInd][name+1].innerHTML!='⛌') {
                        AI.last = 0;
                        element = player.fields[parentInd][name+1];
                    }
                    else if(parentInd+1<=9 && player.fields[parentInd+1][name].innerHTML!='⛌') {
                        AI.last = 1;
                        element = player.fields[parentInd+1][name];
                    }
                    else {
                        AI.last = 2;
                        element = player.fields[parentInd][name-1];
                    }
                }
                break;
            }
        }

        for(let el of player.fleet){
            if(el.has(element)){
                element.innerHTML = '&#9938';
                let parentInd1 = parseInt(element.parentElement.attributes['name'].value);
                let name1 = parseInt(element.attributes['name'].value);
                console.log(parentInd1, name1);
                updateFreeFields(element);
                AI.turn = true;
                el.delete(element);
                if(curHit) AI.hit = true;
                curHit = true;
                if(el.size==0){
                    putCrosses(player,el);
                    AI.last = null;
                    AI.hit = false;
                    curHit = false;
                    if(gameOver(player)){
                        AI.turn = false;
                        endGame(AI);
                        return;
                    }
                }
                else{
                    if(AI.last===null){
                        oname = name;
                        oparentInd = parentInd;
                        AI.last = 0;
                    }else{
                        switch(AI.last){
                            case 0:
                            name++;
                            break;
                            case 1:
                            parentInd++;
                            break;
                            case 2:
                            name--;
                            break;
                            case 3:
                            parentInd--;
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    if(AI.last!==null){

        if(AI.hit){
            name = oname;
            parentInd = oparentInd;

            switch(AI.last){
                case 0:
                AI.last = 2;
                break;
                case 1:
                AI.last = 3;
                break;
                case 2:
                AI.last = 0;
                break;
                case 3:
                AI.last = 1;
                break;
            }
        }
        else AI.last = (AI.last+1)%4;
    }
    AI.hit = false;
    element.innerHTML='&#9932';
    let parentInd2 = parseInt(element.parentElement.attributes['name'].value);
    let name2 = parseInt(element.attributes['name'].value);
    console.log(parentInd2, name2);
    console.log("----------------");
    updateFreeFields(element);
    txtArea.innerHTML = "Your turn...";
}

function endGame(who){
    for(let el of AI.fields){
        for(let l of el){
            l.removeEventListener('click',playerHit);
        }
    }
    if(who==AI) txtArea.innerHTML = 'You lose!<br><br>Starting new game...';
    else txtArea.innerHTML = 'You win!<br><br>Starting new game...';
    
    setTimeout(function(){
        location.reload();
    },5000);
}
