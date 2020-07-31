/////////////////////////////////
//Player audio
/////////////////////////////////

// DOM identification
var playButton = document.getElementById("play-button");
var player = document.createElement('audio'); // <audio>

let songNth = 0;
let nextSong;

// On click, démarre les extraits musicaux
playButton.onclick = function () {
    playSong(songNth);
}

let startedAt;

// Lié au son, play, pause au bout de 30 secondes, et on recommence
function playSong() {
    if (songNth < 13) {

        player.setAttribute('src', songsArray[songNth].url);
        player.oncanplay = function () {
           player.play();
           startedAt = new Date().getTime()
           startTimer();
   
           if (songNth < songsArray.length) {
               nextSong = setTimeout(function(){
                   player.pause();
                   // console.log(new Date().getTime() - startedAt)
                   songNth++;
                   switchBullet();
                   countForEnd();
                   setTimeout(function() {
                        resetTimer();
                        playSong();
                        reinAnswersBloc();
                        album();
                   }, 4000);
               }, 30000);
           }
        //    resetTimer();
       };

    } else {
        nextSong = setTimeout(function(){
            player.pause();
            switchBullet();
            countForEnd();
            setTimeout(function() {
                 resetTimer();
                 reinAnswersBloc();
                 album();
            }, 4000);
        }, 30000);

        // Affiche la pop-up de fin de partie
        endModal();
    }
}


/////////////////////////////////////////
//Move bullet
////////////////////////////////////////
function switchBullet () {
    // document.querySelector(`.right${songNth}`).style.transform = "translateX(-10px)";
    document.querySelector(`.right${songNth}`).classList.add("hidden");
    document.querySelector(`.left${songNth}`).classList.remove("hidden");

    if ((titleBloc.classList.contains("found")) && (artisteBloc.classList.contains("found"))) {
        document.querySelector(`.left${songNth}`).style.background = "#3e8188";
        document.querySelector(`.left${songNth}`).classList.add("OK");
    } else if ((titleBloc.classList.contains("not-found")) && (artisteBloc.classList.contains("not-found"))) {
        document.querySelector(`.left${songNth}`).style.background = "#ff79a1";
    } else {}
}

// function switchBullet () {
//     document.querySelector(`.extract${songNth}`).style.right = "auto";
//     document.querySelector(`.extract${songNth}`).style.animation = "run 1s cubic-bezier(.47,0,.74,.71)";
//     if ((titleBloc.classList.contains("found")) && (artisteBloc.classList.contains("found"))) {
//         document.querySelector(`.extract${songNth}`).style.background = "#3e8188";
//     } else if ((titleBloc.classList.contains("not-found")) && (artisteBloc.classList.contains("not-found"))) {
//         document.querySelector(`.extract${songNth}`).style.background = "#ff79a1";
//     } else {}
// }


/////////////////////////////////////////
//BONUS Combo
//////////////////////////////////////
function comboBonus() {

    if (songNth === 0) {
        // Ne fait rien
    } else {

        let pastSong = `.left${songNth}`

        if ((titleBloc.classList.contains("found")) && (artisteBloc.classList.contains("found"))) {
            if (document.querySelector(pastSong).classList.contains("OK")) { 
    
                //Affiche les points
                if (comboBloc.classList.contains("not-found")) {
                    score += 1;
                    pointsPlace.textContent = `${score} points`;
                }
    
                comboBloc.classList.remove("not-found");
                comboBloc.classList.add("found");
            }
        }

    }
}


/////////////////////////////////////////
//End modal
//////////////////////////////////////
function countForEnd () {
    if ((titleBloc.classList.contains("found")) && (artisteBloc.classList.contains("not-found"))) { //Que le titre
        endTitleNumber += 1;

    } else if ((titleBloc.classList.contains("not-found")) && (artisteBloc.classList.contains("found"))) { //Que l'artiste
        endArtistNumber += 1;

    } else if ((titleBloc.classList.contains("found")) && (artisteBloc.classList.contains("found"))) { //Tout trouvé
        endFoundNumber += 1;

    } else if ((titleBloc.classList.contains("not-found")) && (artisteBloc.classList.contains("not-found"))) { //Rien trouvé
        endNotFoundNumber += 1;

    }

    if (comboBloc.classList.contains("found")) {
        endComboNumber += 1;
    }

    if (speedBloc.classList.contains("found")) {
        endSpeedNumber += 1;
    }

}


function endModal () {
    document.querySelector(".end-score").innerHTML = score;
    document.querySelector(".end-not-found-number p").innerHTML = endNotFoundNumber;
    document.querySelector(".end-artist-number p").innerHTML = endArtistNumber;
    document.querySelector(".end-title-number p").innerHTML = endTitleNumber;
    document.querySelector(".end-found-number p").innerHTML = endFoundNumber;
    document.querySelector(".end-speed-number p").innerHTML = endSpeedNumber;
    document.querySelector(".end-combo-number p").innerHTML = endComboNumber;

    openPopUp(endmodal);
}