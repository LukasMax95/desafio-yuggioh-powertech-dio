const state ={
    score: {
        playerscore: 0,
        oppoenentScore: 0,
        scoreBox: {
            win: document.getElementById("win"),
            lose: document.getElementById("lose")
        }
    },
    cardSprites:{
        avatar: document.getElementById("card-img"),
        card_name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards:{
        player: document.getElementById("player-card"),
        opponent: document.getElementById("opponent-card")
    },
    playerSides: {
        player1: "player",
        player1_box: document.querySelector(".card_box.framed#player"),
        opponent1: "opponent",
        oponent1_box: document.querySelector(".card_box.framed#opponent")
    },
    button: document.getElementById("next-duel")
};

const pathImages = "src/assets/icons/";

const cardData = [
    {
        id:0,
        cardname: "Blue Eyes White Dragon",
        type: "Paper",
        img: pathImages +"dragon.png",
        winOf: "Rock",
        loseOf: "Scisors"
    },
    {
        id:1,
        cardname: "Black Magician",
        type: "Rock",
        img: pathImages +"magician.png",
        winOf: "Scisors",
        loseOf: "Paper"
    },
    {
        id:2,
        cardname: "Exodia",
        type: "Scisors",
        img: pathImages +"exodia.png",
        winOf: "Paper",
        loseOf: "Rock"
    }
];

let finished = false;

function showHiddenCardFields(value){
    if(value){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.opponent.style.display = "block";
    }else{
        state.fieldCards.player.style.display = "none";
        state.fieldCards.opponent.style.display = "none";
    }
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function resetDuel(){
    if(finished){
        state.cardSprites.avatar.src = "";
        state.button.style.display = "none";
        showHiddenCardFields(false);
        finished = false;
        init(); 
    }
}

async function updateScore(){
    state.score.scoreBox.win.innerText=`Win: ${state.score.playerscore}`;
    state.score.scoreBox.lose.innerText=`Loss: ${state.score.oppoenentScore}`;
}

async function removeAllCardsImages(){
    let cards = state.playerSides.oponent1_box;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img)=>img.remove());
    cards = state.playerSides.player1_box;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img)=>img.remove());
}

async function drawButton(duelResults){
    state.button.innerText = duelResults;
    state.button.style = "block";
}

async function setCardsField(cardId){
    await removeAllCardsImages();

    let pcCardId = await getRandomCardId();
    showHiddenCardFields(true);
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.opponent.src = cardData[pcCardId].img;
    let duelResults = await checkDuelResults(cardId, pcCardId);
    await updateScore();
    drawButton(duelResults);
}

async function getRandomCardId(){
    console.log(cardData.length);
    const i = Math.floor(Math.random()*cardData.length);
    console.log(i);
    return cardData[i].id;
}

async function drawSelectCard(idCard){
    state.cardSprites.avatar.src = cardData[idCard].img;
    state.cardSprites.card_name.innerText = cardData[idCard].cardname;
    state.cardSprites.type.innerText = cardData[idCard].type;
}

async function createCardImage(randomIdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));

        });
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(randomIdCard);
        });
    }
    return cardImage;
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        console.log(fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function checkDuelResults(card1, card2){
    let duelResults = "DRAW";
    let playerCard = cardData[card1];
    let computerCard = cardData[card2];
    if(playerCard.winOf === computerCard.type){
        duelResults = "WIN";
        state.score.playerscore++;
        await playAudio("win");
    }
    if(playerCard.loseOf === computerCard.type){
        duelResults = "LOSS";
        state.score.oppoenentScore++;
        await playAudio("lose");
    }
    finished = true;
    return duelResults;
}

function startGame(){
    state.button.style.display = "none";
    showHiddenCardFields(false);
    state.cardSprites.card_name.innerText = "-";
    state.cardSprites.type.innerText = "-";
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.opponent1);
}


function init(){
    startGame();
    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();