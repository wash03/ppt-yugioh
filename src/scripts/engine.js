const state = {
    score: {
        player: 0,
        computer: 0,
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    actions: {
        button: document.getElementById('next-duel'),
    }
};

const playersSides = {
    player: "player-cards",
    computer: "computer-cards",
}
const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Dragão Branco de Olhos Azuis",
        type: "Papel",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Mago Negro",
        type: "Pedra",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exódia",
        type: "Tesoura",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    }
]

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();   
}

async function getRandomCardId(){
    const randomIndex =  Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id
}

async function drawSelectecCard(cardId){
    state.cardSprites.avatar.src = cardData[cardId].img;
    state.cardSprites.name.innerHTML = cardData[cardId].name;
    state.cardSprites.type.innerHTML = "atributo: " + cardData[cardId].type;
}

async function removeAllCards(){
    let cards = document.querySelector('#'+playersSides.computer);
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach(img => img.remove());

    cards = document.querySelector('#'+playersSides.player);
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach(img => img.remove());
}

async function checkDuel(playerCardId, computerCardId){
    let result = "Empate";
    let playerCard = cardData[playerCardId];

    if (playerCard.winOf.includes(computerCardId)) {
        result = "Vitória";
        await playAudio("win");
        state.score.player++;
    } else if (playerCard.loseOf.includes(computerCardId)) {
        result = "Derrota";
        await playAudio("lose");
        state.score.computer++;
    }
        
    return result
}

async function drawButton(result){
    state.actions.button.innerHTML = result;
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerHTML = `Win: ${state.score.player} | Loss: ${state.score.computer}` 
}

async function setCardField(cardId){
    await removeAllCards();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuel(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function createCardImage(cardId, fieldSide){
    const card = document.createElement('img');
    card.setAttribute("height", "100");
    card.setAttribute("src", `${pathImages}card-back.png`);
    card.setAttribute("data-id", cardId);
    card.classList.add("card");

    if(fieldSide === playersSides.player){
        card.addEventListener('mouseover', () => {
            drawSelectecCard(cardId);
        })

        card.addEventListener('click', () => {
            setCardField(card.getAttribute("data-id"));
        })
        
    }

    return card;
}


async function drawCards(cardNumbers, fieldSide){
    for (let index = 0; index < cardNumbers; index++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

function init(){
    drawCards(5, playersSides.player);
    drawCards(5, playersSides.computer);

    let musica = document.getElementById("bgm");
    musica.play();
}

init();
