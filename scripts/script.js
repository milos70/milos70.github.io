"use strict";

document.getElementById("b92").addEventListener("click", link);
document.getElementById("twitch").addEventListener("click", link);
document.getElementById("yt").addEventListener("click", link);
document.getElementById("startit").addEventListener("click", link);

document.getElementById('blackjack').addEventListener("click",function(){
    window.open('blackjack/blackjack.html',"_blank");
});
document.getElementById('tic-tac-toe').addEventListener("click",function(){
    window.open('tic-tac-toe/tic-tac-toe.html',"_blank");
});

document.getElementById('battleship').addEventListener("click",function(){
    window.open('battleship/battleship.html',"_blank");
});


function link(){
    let url;
    switch(this.id){
        case 'b92':
        url = "https://www.b92.net/";
        break;
        case 'yt':
        url = "https://www.youtube.com/";
        break;
        case 'twitch':
        url = "https://www.twitch.tv/";
        break;
        default:
        url = 'https://startit.rs/';
        break;
        
    }
    window.open(url,"_blank");
}