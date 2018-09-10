"use strict";

let playerSign='O';
let AISign='X';
let table = document.getElementsByTagName('td');
let last=table[0];
table[0].innerText=AISign;
for(let i=0;i<table.length;i++) {
    table[i].addEventListener('click',setSign);
    table[i].addEventListener('mouseenter',highlight);
    table[i].addEventListener('mouseleave',unHighlight);
    
}


function win(sign){
    
    let count=0, mark=0;

    loop1:
    for(let i=0;i<9;i+=3){
        count = 0, mark=0;
        for(let j=i;j<i+3;j++){
            if(table[j].innerText==sign) count++;
            else if(table[j].innerText=='') mark = j;
            else continue loop1;
        }
        if(count==2) {
            table[mark].innerText = AISign;
            if(sign==AISign)  {
                for(let el of table) el.removeEventListener('click',setSign);
                setTimeout(newGame,2500);
            }
            else {
                let check=false;
                for(let el of table) if(el.innerText=='') {
                    check=true;
                    break;
                }
                if(!check)  {
                    for(let el of table) el.removeEventListener('click',setSign);
                    setTimeout(newGame,2500);
                }
            }
            return true;
        }
    }
    loop2:
    for(let i=0;i<3;i++){
        count=0; mark=0;
        for(let j=i;j<i+7;j+=3){
            if(table[j].innerText==sign) count++;
            else if(table[j].innerText=='') mark = j;
            else continue loop2;
        }
        if(count==2) {
            table[mark].innerText = AISign;
            if(sign==AISign)  {
                for(let el of table) el.removeEventListener('click',setSign);
                setTimeout(newGame,2500);
            }
            else {
                let check=false;
                for(let el of table) if(el.innerText=='') {
                    check=true;
                    break;
                }
                if(!check)  {
                    for(let el of table) el.removeEventListener('click',setSign);
                    setTimeout(newGame,2500);
                }
            }
            return true;
        }
    }
    count = 0, mark=0;
    for(let j=0;j<9;j+=4){
        if(table[j].innerText==sign) count++;
            else if(table[j].innerText=='') mark = j;
            else {
                count=0;
                break;
            }
    }

    if(count==2) {
        table[mark].innerText = AISign;
        if(sign==AISign) {
            for(let el of table) el.removeEventListener('click',setSign);
            setTimeout(newGame,2500);
        }
        else {
            let check=false;
            for(let el of table) if(el.innerText=='') {
                check=true;
                break;
            }
            if(!check) {
                for(let el of table) el.removeEventListener('click',setSign);
                setTimeout(newGame,2500);
            }
        }
        return true;
    }

    count = 0, mark=0;
    for(let j=2;j<7;j+=2){
        if(table[j].innerText==sign) count++;
        else if(table[j].innerText=='') mark = j;
        else {
            count=0;
            break;
        }
    }

    if(count==2) {
        table[mark].innerText = AISign;
        if(sign==AISign) {
            for(let el of table) el.removeEventListener('click',setSign);
            setTimeout(newGame,2500);
        }
        else {
            let check=false;
            for(let el of table) if(el.innerText=='') {
                check=true;
                break;
            }
            if(!check) {
                for(let el of table) el.removeEventListener('click',setSign);
                setTimeout(newGame,2500);
            }
        }
        return true;
    }
    return false;
}
function trap(){
    if(table[2].innerText==AISign){
        if(table[8].innerText=='') table[8].innerText = AISign;
        
        else {table[6].innerText=AISign;}
        return true;
    }
    else if(table[6].innerText==AISign){
        if(table[1].innerText==playerSign) table[8].innerText=AISign;
        else if(table[7].innerText==playerSign) table[2].innerText = AISign;
        return true;
    }

    return false;
}

function newGame(){
    for(let el of table) {
        el.innerText='';
        el.addEventListener('click',setSign);
}
    table[0].innerText = AISign;
    last = table[0];
}

function AITurn(){
    if(win(AISign)) return;
    if(win(playerSign)) return;
    if(trap()) return;
    switch(last){
        case table[1]:
        case table[5]:
        case table[7]:
        table[6].innerText=AISign;
        break;
        case table[2]:
        case table[4]:
        table[8].innerText=AISign;
        break;
        case table[3]:
        case table[6]:
        case table[8]:
        table[2].innerText=AISign;
        break;
    }
}

function setSign(){
    if(this.innerText=='') {
        this.innerText=playerSign;
        last = this;
        AITurn();
    }
}

function highlight(){
    if(this.innerText=='') this.classList.add('hoverFree');
    else this.classList.add('hoverFull');
}

function unHighlight(){
    this.classList.remove('hoverFree','hoverFull');
}
