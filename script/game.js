console.log("loaded")

//const firebase = require("firebase");
// Required for side-effects
//require("firebase/firestore");

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyD-M_yqrPfblgto9nPUvwPbzAnUfFJmV7g",
    authDomain: "cocacola-app-test.firebaseapp.com",
    databaseURL: "https://cocacola-app-test.firebaseio.com",
    projectId: "cocacola-app-test",
    storageBucket: "cocacola-app-test.appspot.com",
    messagingSenderId: "907977581611",
    appId: "1:907977581611:web:d8da96e59c5074cb53f66e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
//   db.settings({ timestampInSnapshots: true});

var playerId;
var playerPic;
var playerName;
var timerId;
var challenge_user = null;
var isChallenge = false;
var timers = [];
var soundOn = 1;
// var timeLeft;
// loadgif();

FBInstant.initializeAsync()
  .then(function(){

    var progress = 0;
    var images = ['sprite1', 'sprite2'];
    var interval = setInterval(function(){

        if(progress >=95)
        {
            clearInterval(interval);
            FBInstant.startGameAsync().then(function() {
                console.log('Game has been started');
                //  loadgif();



                playerName = FBInstant.player.getName();
                playerPic = FBInstant.player.getPhoto();
                $('#share-picture').attr("src", playerPic);
                $('#share-name').html(playerName);
                 playerId = FBInstant.player.getID();
                 console.log('player id:' + playerId);

                // db.collection('users').get().then((querySnapshot) => {
                //     querySnapshot.forEach((doc) => {
                //         // console.log(`${doc.id} => ${doc.data()}`);
                //         console.log(doc.data());
                //     });
                // });

                db.collection('users').where('facebook_id', '==', playerId).get().then((querySnapshot) => {
                    let userCount = querySnapshot.size;
                    if(userCount < 1)
                    {
                        console.log('Data Entry');
                        db.collection('users').add({
                            facebook_id: playerId,
                            name: playerName,
                            profile_picture: playerPic,
                            phone: '',
                            selected_foods: [],
                            contextId: '',
                            already_claimed: false,
                            friends_context: [],
                            gameCreated: false,
                            playContextId: ''

                        });
                        
                    }
                    console.log(userCount);
                });
                

                console.log(playerName);
                console.log(playerPic);
                console.log(playerId);
                
                // getContextPlayers();
                loadGame();
                loadAnimation();
            });
        }

        FBInstant.setLoadingProgress(progress);
        progress+=5;
    }, 100)
  }
  
);

function getContextPlayers(){
    var context_id = FBInstant.context.getID();
    var context_type = FBInstant.context.getType();
    console.log('Context Id: ' + context_id);
    console.log('Context Type: ' + context_type);

        if(context_id){

            var contextPlayers = FBInstant.context.getPlayersAsync()
            .then(function(players) {
              console.log(players.map(function(player) {
                return {
                  id: player.getID(),
                  name: player.getName(),
                }
              }));
            });
        }
    
  
    console.log(contextPlayers);
}

function loadGame(){
    const entryPointData = FBInstant.getEntryPointData();
    console.log('Entry Point Data: ' + entryPointData);
    // console.log('Challenge Id: ' + entryPointData.challengeFacebookId);
    var context_id = FBInstant.context.getID();
    var context_type = FBInstant.context.getType();
    console.log('Context Id: ' + context_id);
    console.log('Context Type: ' + context_type);
    if(context_id){

        var challenge_player_id = entryPointData.challengeFacebookId;
                console.log(challenge_player_id);

                if(challenge_player_id){
                    db.collection('users').where('facebook_id', '==', challenge_player_id).get().then((querySnapshot) => {
          
                        if(!querySnapshot.empty) {
                            challenge_user = querySnapshot.docs[0].data()
                            // rest of your code
                            console.log(challenge_user);
                            isChallenge = true; 
                        }
                        startGame();
                    });
                }
                else{
                    startGame(); 
                }
                

            // console.log(contextPlayers);
    }
    else{
        console.log('here');
        startGame();  
    } 
    

}

function loadAnimation(){

    

    //Let's Go animation

    var letsGo = {
        wrapper: document.getElementById('bodymovin2'),
        animType: 'html',
        loop: true,
        prerender: true,
        autoplay: true,
        path: './animation/LetsGo.json'

    };
    var anim = bodymovin.loadAnimation(letsGo);

    var letsGo2 = {
        wrapper: document.getElementById('bodymovin3'),
        animType: 'html',
        loop: true,
        prerender: true,
        autoplay: true,
        path: './animation/LetsGo.json'

    };
    var anim = bodymovin.loadAnimation(letsGo2);

    
    

}


function getel(id) {
    return document.getElementById(id);
}


var playerChoices = [];
//Buttons here
// var startButton = getel("startGame")
// var chooseAsyncButton = getel("chooseAsync")
// var getContextPlayersButton = getel("getContextPlayers")
var challengeStart = getel("challengeStart")
var challengeStartAlt = getel("challengeStartAlt")
// var leaderboardButton = getel("leaderboardButton")
var submitResult = getel("submitResult")
var inviteFriend = getel("inviteFriend")
var playNow = getel("playNow")
// var volumeButton = getel("volumeButton")

//Button Listener
// startButton.addEventListener('click',startGame);
// chooseAsyncButton.addEventListener('click',chooseAsync);
// getContextPlayersButton.addEventListener('click',getContextPlayers);
challengeStart.addEventListener('click',startChallenge);
challengeStartAlt.addEventListener('click',startChallenge);
// playNow.addEventListener('click',nowPlay);
// submitResult.addEventListener('click',showResult);
// inviteFriend.addEventListener('click',inviteFriends);
// volumeButton.addEventListener('click', toggleSound);

var clickPlay = new Audio();
clickPlay.src = 'sound/click.mp3';

var foodSelectSound = new Audio();
foodSelectSound.src = 'sound/food_select.wav';

var timesUp1= new Audio();
timesUp1.src = 'sound/times_up1.wav';

var timesUp2= new Audio();
timesUp2.src = 'sound/times_up2.wav';

var victorySound= new Audio();
victorySound.src = 'sound/victory.mp3';


function playSound(num){

    if(soundOn == 1)
    {
        if(num == 1)
        clickPlay.play();
    else if(num ==2)
        foodSelectSound.play();
    else if(num ==3)
        timesUp1.play();
    else if(num ==4)
        timesUp2.play();
    else if(num ==5)
        victorySound.play();
    }
 

}

function shareAsync(){
    var context_id = FBInstant.context.getID();
    var context_type = FBInstant.context.getType();
    console.log('Context Id: ' + context_id);
    console.log('Context Type: ' + context_type);
    // console.log(IMG_DATA);
    
    FBInstant.shareAsync({
        intent: 'REQUEST',
        image: IMG_DATA,
        text: 'X is asking for your help!',
        data: { challengeFacebookId: null},
      }).then(function() {
        var context_id = FBInstant.context.getID();
        var context_type = FBInstant.context.getType();
        console.log('Context Id: ' + context_id);
        console.log('Context Type: ' + context_type);
        // continue with the game.
      });
}

$(document).on("click", "#shareChallenge", function(){
   
    $("#challengeScreenAlt2").removeClass("hidden");
    var imgData;

    

    html2canvas(document.querySelector("#challengeScreenAlt2"),{
        logging: true,
        useCORS: true,
    }).then(canvas => {
        document.body.appendChild(canvas); 
        console.log(canvas);
          imgData = canvas.toDataURL();
        //   imgData = IMG_DATA;
        console.log(imgData);
        $("#challengeScreenAlt2").addClass("hidden");
        FBInstant.shareAsync({
            intent: 'REQUEST',
            image: imgData,      
            text: "Meh",
            data: { challengeFacebookId: playerId},
        }).then(function() {
            console.log("sharing is done");
            $("#challengeScreenAlt2").addClass("hidden");
            // location.reload();
           });

        // document.body.appendChild(canvas)
    });
    var canvas = document.getElementById('challengeScreenAlt2');
    var imgData = canvas[0].toDataURL("image/png");
    var imgData = canvas.toDataURL();
    


 });



function chooseAsync(){
    var context_id = FBInstant.context.getID();
    var context_type = FBInstant.context.getType();
    console.log('Context Id: ' + context_id);
    console.log('Context Type: ' + context_type);


    FBInstant.context
    .chooseAsync()
    .then(function() {
        
        console.log("context id fetched here");
        var contextId = FBInstant.context.getID(); 
        console.log(FBInstant.context.getID());
    db.collection('users').where('facebook_id', '==', playerId).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()}`);

            db.collection('users').doc(doc.id).update({
                contextId: contextId
            });
            console.log(doc.id);
        });
    });
        // 1234567890
    }).catch((error) => {
        console.error(error);
      });;

    
}



function startGame() {
    
    

    // hidecompChooses()
    // showButtons();
    // hideStartButton();
    console.log('game start');
    $("#homeScreen").addClass("hidden");
    if(isChallenge){
        $('#pick-guess').html("Guess");
        // $('#user-profile-picture').attr("src", challenge_user.profile_picture);
        $('#challenge-user-name').html(challenge_user.name);
        showchallengeScreenAlt();
    }
    else{
        showchallengeScreen();
    }
    loadAnimation();
    // $("#footer").removeClass(" hidden");
    // updatephone()

}

function startChallenge()
{
    
    if(isChallenge){
        hidechallengeScreenAlt() 
    }
    else{
        hidechallengeScreen() 
    }
    
    // showplaynowScreen()
    $("#screenDhaka").removeClass("hidden");
   
}

$("#startGameDhaka").click(function() {
    
    // showplaynowScreen()
    $("#screenDhaka").addClass("hidden");
    $("#step1").removeClass("hidden");
});



$(".the-clickable-circle").click(function() {
    
    var choice = $(this).data('food');
    console.log(choice);
    $("#"+choice).effect( "shake", { direction: "right", times: 2, distance: 10, easing :"linear" }, 1000 );
    playerChoices.push(choice);
    console.log(playerChoices);
    var step = parseInt($(this).closest('.dishes').attr('data-step'));
    if(step == 1){
        var imageUrl = "";
        if(choice == 'polao'){
            imageUrl = '../img/Polao.png';
        }
        else if(choice == 'rice'){
            imageUrl = '../img/PlainRice.png';
        }
        else if(choice == 'khichuri'){
            imageUrl = '../img/Khichuri.png';
        }
        else{
            imageUrl = '../img/biriyani.png';
        }
        $("#selected-rice").css("background-image", "url(" + imageUrl + ")"); 
    }
    else if(step == 2){
        var imageUrl = "";
        if(choice == 'mutton'){
            imageUrl = '../img/Mutton.png';
        }
        else if(choice == 'beef'){
            imageUrl = '../img/beefrezala.png';
        }
        else if(choice == 'chicken'){
            imageUrl = '../img/chickenrezala.png';
        }
        else{
            imageUrl = '../img/roast.png';
        }
        $("#selected-meat").css("background-image", "url(" + imageUrl + ")"); 
    }
    else if(step == 3){
        var imageUrl = "";
        if(choice == 'ilish'){
            imageUrl = '../img/Ilish.png';
        }
        else if(choice == 'dimvuna'){
            imageUrl = '../img/dimbhuna.png';
        }
        else if(choice == 'shutki'){
            imageUrl = '../img/shutki.png';
        }
        else{
            imageUrl = '../img/Kabab.png';
        }
        $("#selected-fish").css("background-image", "url(" + imageUrl + ")"); 
    }
    else if(step == 4){
        var imageUrl = "";
        if(choice == 'begunvaji'){
            imageUrl = '../img/Begun.png';
        }
        else if(choice == 'vegetable'){
            imageUrl = '../img/vegetable.png';
        }
        else if(choice == 'salad'){
            imageUrl = '../img/salad.png';
        }
        else{
            imageUrl = '../img/vorta.png';
        }
        $("#selected-veg").css("background-image", "url(" + imageUrl + ")"); 
    }
    console.log(step);
    $("#step" + step).addClass("hidden");

    

    $('#step' + (step+1)).removeClass("hidden");
    if(step == 4){
        console.log('here you go')
        var hereYouGo = {
            wrapper: document.getElementById('bodymovin4'),
            animType: 'html',
            loop: true,
            prerender: true,
            autoplay: true,
            path: './animation/HereYouGo.json'
    
        };
        var anim = bodymovin.loadAnimation(hereYouGo);
    }

});

$(".coke-select").click(function() {
    
    $("#step5").addClass("hidden");
    console.log(playerChoices);
    $("#submit-phone").removeClass("hidden");
});

$("#submit-phone-button").click(function() {
    console.log('Here');
    var phone = $('#user-phone').val();
    console.log(phone);
    if(phone != ''){
        updatephone(phone, playerChoices);
        $("#submit-phone").addClass("hidden");
        console.log(playerChoices);
        $("#inbox-message").removeClass("hidden"); 
        
                    
    }
    
    
});

$("#next-button").click(function() {
    $("#inbox-message").addClass("hidden"); 
    if(isChallenge){
        let challengeChoices = challenge_user.selected_foods;
        const intersection = playerChoices.filter(element => challengeChoices.includes(element));

        var score = 2 + (intersection.length * 2);
        if(score == 10){
           $('#challenge-score').html(score);
           $("#score-full").removeClass("hidden");
           //Congratulations particle
            var animData = {
                wrapper: document.getElementById('bodymovin'),
                animType: 'html',
                loop: true,
                prerender: true,
                autoplay: true,
                path: './animation/winningParticle.json'

            };
            var anim = bodymovin.loadAnimation(animData);
        }
        else{
           $('#challenge-score-avg').html(score);
           $("#score-average").removeClass("hidden");
        }
         
   }
   else{
       $("#share-with-friends").removeClass("hidden"); 
   }
});


$(".restartGame").click(function() {
    
    playerChoices = [];
    challenge_user = null;
    isChallenge = false;
    // chooseAsync();
    // $("#step5").addClass("hidden");
    console.log(playerChoices);
    $("#score-full").addClass("hidden");
    $("#score-average").addClass("hidden");
    // startChallenge();
    startGame();
    // $("#submit-phone").removeClass("hidden");
});

$(".shareResult").click(function() {
    
    //chooseAsync();
    shareAsync();
    // $("#step5").addClass("hidden");
    // console.log(playerChoices);
    // $("#submit-phone").removeClass("hidden");
});






function nowPlay()
{
    playSound(1);
    // showplaynowScreen()
    hideplaynowScreen()
    showGamePlay();
    setSound();
    setTimer();

}

function setSound()
{
    if(soundOn == 1){
        var menu_sound = document.getElementById("menu-sound"); 
        var food_sound = document.getElementById("food-select-sound");
        
        menu_sound.pause();
        food_sound.play(); 
    }

    

}

function toggleSound()
{
    var menu_sound = document.getElementById("menu-sound"); 
    if(soundOn == 1){
        soundOn = 0;
        menu_sound.pause();
        console.log(soundOn);
        $('.volume-button').css("background-image", "url('../img/volume_off.png')");
    }
    else
    {
        soundOn = 1;
        menu_sound.play();
        console.log(soundOn);
        $('.volume-button').css("background-image", "url('../img/volume.png')");
    }
}



function setTimer()
{
    var timeLeft = 30;
    var elem = document.getElementById('time');
    
    timers.push(setInterval(countdown, 1000));
    console.log(timers);
    
    function countdown() {
      if (timeLeft == 0) {
        playSound(4);
        $('#popUps').removeClass('hidden');
        $('#gamePlay').addClass('blur'); 
       
        $('.time-up').removeClass('hidden');
        clearTimer();
        // doSomething();
      } else {
        elem.innerHTML = timeLeft;
        $('#timer-input').val(timeLeft);
        timeLeft--;
      }
    }
}

function clearTimer()
{
    for (var i = 0; i < timers.length; i++)
    {
        clearInterval(timers[i]);
    }
    console.log('Interval cleared');
}


//Screens here
var gamePlay = getel("gamePlay")
var homeScreen = getel("homeScreen")
var playnowScreen = getel("playnowScreen")
var challengeScreen = getel("challengeScreen")
var challengeScreenAlt = getel("challengeScreenAlt")
var leaderboardScreen = getel("leaderboardScreen")
var howtoPlayScreen = getel("howtoPlayScreen")


var resultHolder = getel("results")

var playButtons = document.getElementsByClassName("playbutton");
var foodItems = document.getElementsByClassName("item");
//console.log(foodItems);


// var buttongroup = getel("buttongroup") //group of the buttons

var choices = ["rock","scissors","paper"]




Array.from(playButtons).forEach(btn => {
    btn.addEventListener("click",buttonClicked);
});

// Array.from(foodItems).forEach(btn => {
//     btn.addEventListener("click",itemSelected);
// });

const foodItemName = ["Chicken Biryani","Chicken Rezala", "coke", "Dim Bhuna", "Begun Fry", "Ilish Fry", "Kebab", "Khichuri", "Mutton Rezala", "Polao", "Chingri Bhuna", "rice", "roast", "Rui Bhuna", "Shutki Bhuna", 
"Beef Rezala", "vegetable", "Bhorta" ];
const fooditemImage = ["chicken_biriyani.png","chicken_curry.png", "coke.png", "dim.png", "begun-alt.png",
 "ilish-alt.png", "kabab-alt.png", "khichuri.png", "mutton.png", "polao.png",
 "shrimp.png", "rice.png", "roast-alt.png", "rui-alt.png", "shutki.png",
 "beef.png", "veg.png", "vorta.png" ];
var selectedFoods = new Array();
var mainItemSelected = 0;
var cokeSelected = 0;






function playAgain()
{
    selectedFoods = [];
    mainItemSelected = 0;
    cokeSelected = 0;
    
    $(".regular-item").each(function( index, element ) {
        
        $(element).addClass("noimage");
            $(element).removeClass("hasimage");
            
            $(element).attr("src", "img/blank.png");
            
      });

      $('.main-item-food').addClass("noimage");
      $('.main-item-food').removeClass("hasimage");
            
      $('.main-item-food').attr("src", "img/blank.png");

            $('.cocacola-item').addClass("noimage");
            $('.cocacola-item').addClass("regular-item");
            $('.cocacola-item').addClass("cocacola-regular-style");
            $('.cocacola-item').removeClass("cocacola-bottle-style");
            $('.cocacola-item').removeClass("hasimage");
            $('.cocacola-item').attr("src", "img/blank.png");


            $(".food-list").html('');

            $(".item").each(function( index, element ) {
        
                $(element).show();
                    
              });
    
}

$( ".try-again-button" ).click(function() {
    playAgain();
    $("#gamePlay").removeClass("blur");
            $("#popUps").addClass(" hidden");
            $( this ).closest('.pop').addClass("hidden");
            
            setTimer();
});


function inviteFriends()
{

    console.log('here invite');
    FBInstant.context
  .chooseAsync({
    filters: ['NEW_CONTEXT_ONLY'],
    minSize: 2,
  })
  .then(function() {
      var contextId = FBInstant.context.getID(); 
    console.log(FBInstant.context.getID());
    db.collection('users').where('facebook_id', '==', playerId).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()}`);

            db.collection('users').doc(doc.id).update({
                contextId: contextId
            });
            console.log(doc.id);
        });
    });
    // 1234567890
  });
}


function add_score_to_leaderboard()
{
    var time_remaining = parseInt($('#timer-input').val());
    var score = 120 + time_remaining;
    console.log(score);
    FBInstant
    .getLeaderboardAsync('global')
    .then(leaderboard => {
      console.log(leaderboard.getName());
      return leaderboard.setScoreAsync(score, '{race: "elf", level: 3}');
    })
    .then(() => console.log('Score saved'))
    .catch(error => console.error(error));
}




$( ".submit-number" ).click(function() {
    $( this ).closest('.pop').addClass("hidden");
    var phone_no = $('.user-number').val();
    console.log(phone_no)
    $('.done').removeClass('hidden');   
   
    if(phone_no != ''){
        updatephone(phone_no);
                    
    }
});


$( ".small-skip" ).click(function() {
    $( this ).closest('.pop').addClass("hidden");
    $('.done').removeClass('hidden');   
   
});




function cokeReveal()
{
    Swal.fire({
        imageUrl: 'img/something-missing.png',
        imageHeight: 50,
        imageAlt: 'Cocacola',
        confirmButtonText: 'CLICK TO REVEAL'
      }).then((result) => {
        if (result.value) {

            $('.cocacola-item').removeClass("noimage");
            $('.cocacola-item').addClass("hasimage");
            $('.cocacola-item').addClass("tableitem-3");
            $('.cocacola-item').attr("src", "img/" + fooditemImage[2]);

            $(".food-list").append('<li id="foodlist"><span class="name-holder-list">'+ 'কোকা-কোলা' + 
            '</span></li>');
            // gotoResult();
            $('.header-image').attr("src", "img/friday-menu.png");
            cokeSelected = 3;
          
        }
      })

      

}


function showResultTable(){

    

    $(".cancel-image").each(function( index, element ) {
        $(element).hide();
      });


    $(".result-item").each(function( index, element ) {
        var totalSelected = selectedFoods.length;
        if(index < totalSelected)
        {
            $(element).removeClass("noimage");
            $(element).addClass("hasimage");
            $(element).attr("src", "img/" + fooditemImage[selectedFoods[index] - 1]);
            // $(".result-food-list").append('<li><span class="name-holder-list">'+ foodItemName[food_item - 1] + 
            // '</span></li>');

        }
        else
        {
            return false;
        }
        
      });

}



function updatephone(phoneNo, result)
{

    db.collection('users').where('facebook_id', '==', playerId).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()}`);

            db.collection('users').doc(doc.id).update({
                phone: phoneNo,
                selected_foods: result,
            });
            console.log(doc.id);
        });
    });

    console.log('Phone update here');
}

$(document).on("click", "#go-back-challenge", function(){

    playSound(1);
    hideleaderboardScreen();
    hidehowtoPlayScreen();
    showchallengeScreen();

});

$(document).on("click", "#howtoplayButton", function(){

    playSound(1);
    hidechallengeScreen();
    hideplaynowScreen();
    showhowtoPlayScreen();
    

});








function buttonClicked(e){
    var btnChoice = e.target.id;
    console.log(e.target.id);
    // playChoice(btnChoice);

}


 $(document).on('click', '.close-pop', function(){ 
            $("#gamePlay").removeClass("blur");
            $("#popUps").addClass(" hidden");
            $( this ).parent().addClass("hidden");
    });


// function showButtons() {
//     if(buttongroup.classList.contains("hidden")){
//         buttongroup.classList.remove("hidden")
//     }
// }

// function hideButtons() {
//     if(!buttongroup.classList.contains("hidden")){
//         buttongroup.classList.add("hidden")
//     }
// }

// function hideStartButton() {
//     if(!startButton.classList.contains("hidden")){
//         startButton.classList.add("hidden")
//     }
//     if(!homeScreen.classList.contains("hidden")){
//         homeScreen.classList.add("hidden")
//     }
    
// }
// function showStartButton() {
//     if(startButton.classList.contains("hidden")){
//         startButton.classList.remove("hidden")
//     }

//     if(homeScreen.classList.contains("hidden")){
//         homeScreen.classList.remove("hidden")
//     }
// }

function hideGamePlay() {
    if(!gamePlay.classList.contains("hidden")){
        gamePlay.classList.add("hidden")
    }
}
function showGamePlay() {
    if(gamePlay.classList.contains("hidden")){
        gamePlay.classList.remove("hidden")
    }
}


function hidechallengeScreen() {
    if(!challengeScreen.classList.contains("hidden")){
        challengeScreen.classList.add("hidden")
    }
}
function showchallengeScreen() {
    if(challengeScreen.classList.contains("hidden")){
        challengeScreen.classList.remove("hidden")
    }
}

function hidechallengeScreenAlt() {
    if(!challengeScreenAlt.classList.contains("hidden")){
        challengeScreenAlt.classList.add("hidden")
    }
}
function showchallengeScreenAlt() {
    if(challengeScreenAlt.classList.contains("hidden")){
        challengeScreenAlt.classList.remove("hidden")
    }
}





function hidehowtoPlayScreen() {
    if(!howtoPlayScreen.classList.contains("hidden")){
        howtoPlayScreen.classList.add("hidden")
    }
}
function showhowtoPlayScreen() {
    if(howtoPlayScreen.classList.contains("hidden")){
        howtoPlayScreen.classList.remove("hidden")
    }
}



function hideplaynowScreen() {
    if(!playnowScreen.classList.contains("hidden")){
        playnowScreen.classList.add("hidden")
    }
}
function showplaynowScreen() {
    if(playnowScreen.classList.contains("hidden")){
        playnowScreen.classList.remove("hidden")
    }
}



function showResultHolder() {
    if(resultHolder.classList.contains("hidden")){
        resultHolder.classList.remove("hidden")
    }
}

function hideResultHolder() {
    //console.log('hide result')
    resultHolder.classList.add("hidden")
   // $('#results').hide();
    if(resultHolder.classList.contains("hidden")){
        
    }
}


