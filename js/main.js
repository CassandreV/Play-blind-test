let pointsPlace = document.querySelector(".points");
let score = 0;
let endNotFoundNumber = 0;
let endArtistNumber = 0;
let endTitleNumber = 0;
let endFoundNumber = 0;
let endSpeedNumber = 0;
let endComboNumber = 0;


/////////////////////////////////
//Affiche des commentaires selon les réponses
/////////////////////////////////
let comments = document.querySelector("#fly-in");

function innerComments (text) {
    comments.innerHTML = text;

    comments.classList.remove("comments-animation");
    void comments.offsetWidth;
    comments.classList.add("comments-animation");

    setTimeout(function() {
        comments.innerHTML = "";
        console.log("setTimeOut");
      } ,1500);
}


/////////////////////////////////
//Pop-up pour démarrage de partie
/////////////////////////////////

const playPopUpButtons = document.querySelectorAll('[data-play-button]');
const overlay = document.getElementById('overlay');

// Au chargement de la page, attends 3 sec puis affiche la pop up
window.setTimeout(function () {window.onload = openPopUp(modal);}, 3000);
  
// Fonction : ouvrir la pop up
function openPopUp(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}
  
// Fonction : fermer la pop up
function closePopUp(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

// Fonction : au clic hors pop-up, ferme la pop-up
overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
      closePopUp(modal);
      playSong(songNth);
    })
})

// Fonction : au clic sur le bouton, ferme la pop-up
playPopUpButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closePopUp(modal)
  })
})

/////////////////////////////////////////
//Clear input on click for typing answer
////////////////////////////////////////
const answerInput = document.querySelector('.typing');

// Au chargement de la page, affiche "le titre et/ou l'artiste"
window.onload = function () {
    answerInput.value = "Le titre et/ou l'artiste";
}


/////////////////////////////////////////
// Fonction Clear Input
////////////////////////////////////////
function clearInput () {
    answerInput.value = '';
}

// Au click, laisse le champ vide pour la réponse
answerInput.onclick = clearInput;


/////////////////////////////////////////
//Link input to OK + enter
////////////////////////////////////////

//Au clic sur "ok" OU sur touche enter
var okButton = document.querySelector(".ok");
okButton.onclick = function () {
    // findArtist();
    // findTitle();
    // findTitleOrArtist();
    scoreArtist();
    scoreTitle();
    scoreTitleOrArtist();
    applyBestAnswer();
    speedBonus();
    comboBonus();
    clearInput();
}

document.onkeydown = function () {
    if (event.keyCode === 13) {
        // findArtist();
        // findTitle();
        // findTitleOrArtist();
        scoreArtist();
        scoreTitle();
        scoreTitleOrArtist();
        applyBestAnswer();
        speedBonus();
        comboBonus();
        clearInput();
    }
}

/////////////////////////////////////////
//Take the higher score
////////////////////////////////////////
function applyBestAnswer() {
    let scoresArr = [Number(findArtistScore), Number(findTitleScore), Number(TitleThenArtistScore), Number(ArtistThenTitleScore)];
    let bestScoreIndex = scoresArr.indexOf(Math.max(...scoresArr));

    switch (bestScoreIndex) {
        case 0: // artist
            findArtist(findArtistScore);
            break;
        case 1: // title
            findTitle(findTitleScore);
            break;
        case 2 : //both
            findTitleOrArtist(TitleThenArtistScore, ArtistThenTitleScore);
            break;
        case 3 : //both
        findTitleOrArtist(TitleThenArtistScore, ArtistThenTitleScore);
        break;
    }
}


/////////////////////////////////////////
//Test Input Answer for artist
////////////////////////////////////////
let artisteBloc = document.querySelector(".artist");
let findArtistScore;

function scoreArtist () {
    let answerValue = document.querySelector("input").value;

    // Compare input à réponse attendue : artiste
    let artistToFind =  songsArray[songNth].artist.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let scoringMatch = artistToFind.score(answerValue); //=> 0.7172727272727272 Example
    findArtistScore = scoringMatch;
}

function findArtist (scoringMatch) {
    let artistToFind =  songsArray[songNth].artist.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Compare input à réponse attendue : titre
    if (scoringMatch > 0.8 && scoringMatch < 1) {

        //Affiche les points
        if (artisteBloc.classList.contains("not-found")) {
            score += 1;
            pointsPlace.textContent = `${score} points`;
            console.log(score);
        }

        // Affiche le nom de l'artiste trouvé
        artisteBloc.classList.remove("not-found");
        artisteBloc.classList.add("found");
        artisteBloc.innerHTML = `
        <i class="fas fa-microphone-alt"></i>
        ${artistToFind}
        <i class="fas fa-check"></i>`
        
    } else if (scoringMatch > 0.4 && scoringMatch < 0.8) {
        innerComments("Presque");
        console.log("Presque");
    } else {
        answerError();
    }
}

/////////////////////////////////////////
//Test Input Answer for title
////////////////////////////////////////
let titleBloc = document.querySelector(".title");
let findTitleScore;

function scoreTitle () {
    let answerValue = document.querySelector("input").value;

    // Compare input à réponse attendue : artiste
    let titleToFind =  songsArray[songNth].title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let scoringMatch = titleToFind.score(answerValue); //=> 0.7172727272727272 Example
    findTitleScore = scoringMatch;
}

function findTitle (scoringMatch) {
    let titleToFind =  songsArray[songNth].title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Compare input à réponse attendue : titre
    if (scoringMatch > 0.8 && scoringMatch < 1) {


        //Affiche les points
        if (titleBloc.classList.contains("not-found")) {
            score += 1;
            pointsPlace.textContent = `${score} points`;
            console.log(score);
        }

        // Affiche le titre trouvé
        titleBloc.classList.remove("not-found");
        titleBloc.classList.add("found");
        titleBloc.innerHTML = `
        <i class="fas fa-music"></i>
        ${titleToFind}
        <i class="fas fa-check"></i>`
        
    } else if (scoringMatch > 0.4 && scoringMatch < 0.8) {
        innerComments("Presque");
    } else {
        answerError();
    }
}


/////////////////////////////////////////
//Test Input Answer for title then Artiste
////////////////////////////////////////
let findTitleOrArtistScore;
let TitleThenArtistScore;
let ArtistThenTitleScore;

function scoreTitleOrArtist () {
    let answerValue = document.querySelector("input").value;

    // Compare input à réponse attendue : artiste
    let artistToFind =  songsArray[songNth].artist.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let titleToFind =  songsArray[songNth].title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let titleThenArtistToFind =  titleToFind + ' ' + artistToFind;
    let artistThenTitleToFind =  artistToFind + ' ' + titleToFind;

    TitleThenArtistScore = titleThenArtistToFind.score(answerValue); //=> 0.7172727272727272 Example
    ArtistThenTitleScore = artistThenTitleToFind.score(answerValue); //=> 0.7172727272727272 Example

    // if (TitleThenArtistScore > ArtistThenTitleScore) {
    //     findTitleOrArtistScore = TitleThenArtistScore;
    // } else {
    //     findTitleOrArtistScore = ArtistThenTitleScore;
    // }
}
    
function findTitleOrArtist (TitleThenArtistScore, ArtistThenTitleScore) {
    let artistToFind =  songsArray[songNth].artist.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let titleToFind =  songsArray[songNth].title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Compare input à réponse attendue : titre
    if ((TitleThenArtistScore > 0.8 && TitleThenArtistScore < 1) || (ArtistThenTitleScore > 0.8 && ArtistThenTitleScore < 1)) {

        //Affiche les points
        if (titleBloc.classList.contains("not-found")) {
            score += 1;
            pointsPlace.textContent = `${score} points`;
        }

        if (artisteBloc.classList.contains("not-found")) {
            score += 1;
            pointsPlace.textContent = `${score} points`;
        }

        // Affiche le titre trouvé
        titleBloc.classList.remove("not-found");
        titleBloc.classList.add("found");
        titleBloc.innerHTML = `
        <i class="fas fa-music"></i>
        ${titleToFind}
        <i class="fas fa-check"></i>`

        // Affiche le nom de l'artiste trouvé
        artisteBloc.classList.remove("not-found");
        artisteBloc.classList.add("found");
        artisteBloc.innerHTML = `
        <i class="fas fa-microphone-alt"></i>
        ${artistToFind}
        <i class="fas fa-check"></i>`
        
    } else if (TitleThenArtistScore > 0.4 && TitleThenArtistScore < 0.8 || ArtistThenTitleScore > 0.4 && ArtistThenTitleScore < 0.8) {        
        innerComments("Presque");
    } else {
        answerError();
    }
}


/////////////////////////////////////////
//Si erreur, message aléatoire
////////////////////////////////////////
let aleat = Math.floor(Math.random() * 7);

function answerError () {
    switch (aleat) {
        case 0:
            innerComments("Pas du tout !");
            break;
        case 1:
            innerComments("C'est pourtant pas si difficile...");
            break;
        case 2:
            innerComments("Nop !");
            break;
        case 3:
            innerComments("Raté... Essaie encore !");
            break;
        case 4:
            innerComments("Nop nop, ce n'est pas ça...");
            break;
        case 5:
            innerComments("Aller... Tu vas réussir !");
            break;
        case 6:
            innerComments("Franchement ? Rien à voir !");
            break;
        case 7:
            innerComments("Aller, un autre essai !");
            break;
    }
}

/////////////////////////////////////////
//Progress bar
////////////////////////////////////////
var progressbar = document.querySelector('.progress-animation');
var progress = document.querySelector('.progress');

let timer; 

function startTimer() {

    let width = 0;
    timer = setInterval(anim, 300);
    
    function anim () {
        if (width <= 100) {
            progressbar.style.width = width + "%";
            width ++;
        }
    }
}

function resetTimer() {
    clearInterval(timer);
}

/////////////////////////////////////////
//Faire apparaitre les albums
////////////////////////////////////////
let albumImg = document.querySelector(".album-img");

function album () {
    // Création de la div mère
    var newDiv = document.createElement("div");
    newDiv.classList.add("album-grid");
    newDiv.classList.add("DOM");

    // contenu imbriqué de la div
    var newImg = document.createElement("img");
    newImg.classList.add("album-img");
    newImg.setAttribute('src', songsArray[songNth-1].album);
    newImg.setAttribute('alt', "album cover");
    var singerP = document.createElement("p");
    singerP.classList.add("singer-name");
    singerP.innerHTML = songsArray[songNth-1].artist;
    var songP = document.createElement("p");
    songP.classList.add("song-name");
    songP.innerHTML = songsArray[songNth-1].title;

    // ajoute le contenu dans la div mère
    newDiv.appendChild(newImg);
    newDiv.appendChild(singerP);
    newDiv.appendChild(songP);

    // Obtient une référence à l'élément après lequel nous voulons insérer
    var sp2 = document.querySelector(".album-grid");
    // Obtient une référence à l'élément parent
    var parentDiv = sp2.parentNode;
    
    // ajoute le nouvel élément créé et son contenu dans le DOM
    var currentDiv = document.querySelector(".album-grid");
    parentDiv.insertBefore(newDiv, sp2);
}

/////////////////////////////////////////
//BONUS rapidité
////////////////////////////////////////
let speedBloc = document.querySelector(".speed");
let comboBloc = document.querySelector(".combo");

function speedBonus() {
    if ((titleBloc.classList.contains("found")) && (artisteBloc.classList.contains("found"))) {
        if (Number(progressbar.style.width.substring(0, 2)) <= 40) {

            //Affiche les points
            if (speedBloc.classList.contains("not-found")) {
                score += 1;
                pointsPlace.textContent = `${score} points`;
                console.log(score);
            }


            speedBloc.classList.remove("not-found");
            speedBloc.classList.add("found");
        }
    }
}


/////////////////////////////////////////
//Compte les points
////////////////////////////////////////
function scoringSystem () {
    if (artisteBloc.classList.contains("found")) { score += 1 };
    if (titleBloc.classList.contains("found")) { score += 1 };
    if (speedBloc.classList.contains("found")) { score += 1 };
    if (comboBloc.classList.contains("found")) { score += 1 };
}


/////////////////////////////////////////
//Réinitialise les blocs de réponses
////////////////////////////////////////
function reinAnswersBloc () {
    // Title
    titleBloc.classList.remove("found");
    titleBloc.classList.add("not-found");
    titleBloc.innerHTML = `
    <i class="fas fa-music"></i>
    Titre ?
    <i class="fas fa-times"></i>`

    // Artiste
    artisteBloc.classList.remove("found");
    artisteBloc.classList.add("not-found");
    artisteBloc.innerHTML = `
    <i class="fas fa-microphone-alt"></i>
    Artiste ?
    <i class="fas fa-times"></i>`

    // Speed Bonus
    speedBloc.classList.add("not-found");
    speedBloc.classList.remove("found");
    
    // Combo Bonus
    comboBloc.classList.add("not-found");
    comboBloc.classList.remove("found");
}

/////////////////////////////////
//Pop-up pour fin de partie
/////////////////////////////////
  
// Fonction : ouvrir la pop up
function openPopUp(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}
  
// Fonction : fermer la pop up
function closePopUp(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

// Fonction : au clic hors pop-up, ferme la pop-up
overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
      closePopUp(modal);
      playSong(songNth);
    })
})

// Fonction : au clic sur le bouton, ferme la pop-up
playPopUpButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closePopUp(modal)
  })
})
