let game;
let movement;
let moles;

function Game (gameState, score, origin) {
    this.gameState = gameState;
    this.score = score;
    this.origin = origin;
    this.moleCount = 0;
    this.userAngle = null;
    this.movementCount = 0;
}

function initialize() {
    game = new Game(true, 0, [window.innerWidth/2, window.innerHeight/2]);
    document.getElementById('board').style.height = window.innerHeight;
    document.getElementById('board').style.width = window.innerWidth;
    $('.box').each(function () {
        $(this).on('click', whackMole);
    });
}

function setDimensions () {
    game.height = window.innerHeight*5/3 + 5;
    game.width = window.innerWidth*5/3 + 5;
    //game.moleHeight = 
    //game.moleWidth = 
    document.getElementById('board').style.height = game.height;
    document.getElementById('board').style.width = game.width;
};

window.onresize = function () {
    setDimensions();
    game.origin = [window.innerWidth/2, window.innerHeight/2];
}

function getCursorCoords (event) {
    game.cursor = [event.clientX, event.clientY];
}

function moveBoard() {
    //calculate movement amount based on cursor relation to origin
    let movementAmountX = 7 * (Math.abs(game.origin[0] - game.cursor[0])/game.origin[0]);
    let movementAmountY = 7 * (Math.abs(game.origin[1] - game.cursor[1])/game.origin[1]);
    let board = document.getElementById('board');

    //are we at either edge of the board?
    if (board.offsetLeft < 0 && board.offsetLeft > -(2/5)*game.width) {
        if (movementAmountX > Math.abs(board.offsetLeft) && game.cursor[0] < game.origin[0]) {
            movementAmountX = Math.abs(board.offsetLeft)
        } else if (movementAmountX > (2/5)*game.width - board.offsetLeft) {
            movementAmountX = Math.abs((2/5)*game.width - board.offsetLeft)
        }
        game.relativeX = game.cursor[0] < game.origin[0] ? game.relativeX + movementAmountX : game.relativeX - movementAmountX;
    } else if (board.offsetLeft >= 0 && game.cursor[0] > game.origin[0]){
        game.relativeX -= movementAmountX;
    } else if (board.offsetLeft <= -(2/5)*game.width && game.cursor[0] < game.origin[0]) {
        game.relativeX += movementAmountX;
    }

    //are we either edge of board?
    if (board.offsetTop < 0 && board.offsetTop > -(2/5)*game.height){
        if (movementAmountY > Math.abs(board.offsetTop) && game.cursor[1] < game.origin[1]) {
            movementAmountY = Math.abs(board.offsetTop)
        } else if (movementAmountY > (2/5)*game.height - board.offsetTop) {
            movementAmountY = Math.abs((2/5)*game.height - board.offsetTop)
        }
        game.relativeY = game.cursor[1] < game.origin[1] ? game.relativeY + movementAmountY : game.relativeY - movementAmountY;
    } else if (board.offsetTop >= 0 && game.cursor[1] > game.origin[1]) {
        game.relativeY -= movementAmountY;
    } else if (board.offsetTop <= -(2/5)*game.height && game.cursor[1] < game.origin[1]) {
        game.relativeY += movementAmountY;
    }

    //set new board position
    document.getElementById('board').style.left = game.relativeX;
    document.getElementById('board').style.top = game.relativeY;
    // $('#angles').html('y:' + game.relativeY + ' movementY: ' + movementAmountY + 'x:' + game.relativeX + ' movementX: ' + movementAmountX);
}

function setMovement (event) {
    clearInterval(movement);
    movement = setInterval(moveBoardMobile, 5, event);
}

function moveBoardMobile(event) { 
    let x;
    let y; 
    if (window.screen.orientation.type === 'landscape-primary') {
        x = event.beta;
        y = Math.abs(event.gamma);
    } else if (window.screen.orientation.type === 'landscape-secondary') {
        x = -event.beta;
        y = event.gamma;
    } else { // portrait mode, nobody holds their phone upside down in portrait oreintation right!?
        x = event.gamma;
        y = event.beta;       
    }

    //set initial position of phone to be the 'neutral position'
    if (game.userAngle === null && y != 0) {
        game.userAngle = y;
    }
       
    //don't want to turn the phone upside down
    if (x > 90) {x = 90};
    if (x < -90) {x = -90};        

    //creating comfortable range of motion for tilting phone forward and back
    if (y < game.userAngle - 30) {y = game.userAngle - 30};
    if (y > game.userAngle + 30) {y = game.userAngle + 30};
    let movementAmountX = Math.abs(20*(x/90));
    let movementAmountY = 20*Math.abs(game.userAngle - y)/30;
    // $('#angles').html('y:' + y + ' movementY: ' + movementAmountY + 'x:' + x + ' movementX: ' + movementAmountX);

    if (board.offsetLeft < 0 && board.offsetLeft > -(2/5)*game.width) {
        if (movementAmountX > Math.abs(board.offsetLeft) && x < 0) {
            movementAmountX = Math.abs(board.offsetLeft);
        } else if (movementAmountX > (2/5)*game.width + board.offsetLeft) {
            movementAmountX = (2/5)*game.width + board.offsetLeft;
        }
        game.relativeX = x < 0 ? game.relativeX + movementAmountX : game.relativeX - movementAmountX;
    } else if (board.offsetLeft >= 0 && x > 0){
        game.relativeX -= movementAmountX;
    } else if (board.offsetLeft <= -(2/5)*game.width && x < 0) {
        game.relativeX += movementAmountX;
    }

    if (board.offsetTop < 0 && board.offsetTop > -(2/5)*game.height){
        if (movementAmountY > Math.abs(board.offsetTop) && y-game.userAngle < 0) {
            movementAmountY = Math.abs(board.offsetTop);
        } else if (movementAmountY > (2/5)*game.height + board.offsetTop) {
            movementAmountY = (2/5)*game.height + board.offsetTop;
        }
        game.relativeY = y-game.userAngle < 0 ? game.relativeY + movementAmountY : game.relativeY - movementAmountY;
    } else if (board.offsetTop >= 0 && y-game.userAngle > 0) {
        game.relativeY -= movementAmountY;
    } else if (board.offsetTop <= -(2/5)*game.height && y-game.userAngle < 0) {
        game.relativeY += movementAmountY;
    }
    $('#relative').html('relativeY: ' + game.relativeY + ' relativeX: ' + game.relativeX);

    //set new board position
    document.getElementById('board').style.left = game.relativeX;
    document.getElementById('board').style.top = game.relativeY;
}

function addMoles () {
    //add a mole to random box that doesn't have mole already
    let openBoxes = [];
    game.moleCount += 1;
    $(".box").not(".mole").each(function(box) {
        openBoxes.push($(this).data('position'));
    });
    if (game.moleCount > 15){
        stopGame();
    }
    let num = Math.floor(Math.random()*openBoxes.length);
    $(".box[data-position='" + openBoxes[num] + "']").addClass('mole');
}

function whackMole () {
    if (game.state){
        if ($(this).hasClass('mole')){
            game.score += 1;
            game.moleCount -= 1;
            if (game.score%10 === 0) {
                if (game.interval >= 750 || game.score%100 === 0){
                    clearInterval(moles);
                    moles = setInterval(addMoles, game.interval-250);
                    game.interval -= 250;
                }
            }
            $(this).removeClass("mole")
        }
    }
}

function removeMoles() {
    $('.box').each(function () {
        $(this).removeClass("mole");
    });  
}

function zoomFull () {
    $('#board').animate({height:window.innerHeight, width:window.innerWidth},
                        {queue:false, duration: 3000, complete: function() {
                            let message;
                            if (game.score === 0){
                                message = 'You whacked 0 moles. You\'re not very protective of your yard . . .';
                            } else if (game.score === 1){
                                message = 'You only whacked 1 mole. Perhaps the cold-blooded nature of it was too much for you, and thus, the moles have ransacked your yard.'
                            } else if (game.score > 1 && game.score < 20){
                                message = 'You whacked ' + game.score + ' moles! At least you\'ve got some motivation. Though, the moles are still having a field day with your turf.'
                            } else if (game.score > 19 && game.score < 50) {
                                message = 'You whacked ' + game.score + ' moles! A decent day\'s worth of mole-whacking! Are you taking lessons with Carl Spackler?';
                            } else if (game.score > 49 && game.score < 100) {
                                message = 'You whacked ' + game.score + ' moles! Your efficiency is staggering.';
                            } else if (game.score > 99 && game.score < 500) {
                                message = 'You whacked ' + game.score + ' moles! A Veritable exterminator you are!';
                            } else {
                                message = 'I\'ve honestly lost count. What is this, some kind of mole-whacking fetish? Well, in that case I guess you\'d like to now that you whacked ' + game.score + ' moles. Nice going weirdo! Did you write a script to beat this or something?';
                            }
                            $('#message').html("<p>" + message + "</p><div id='close' onclick='clearMessage()'></div>").show();
                            $('#startGame').show();
                        }});
    $('#board').animate({top:0, left:0},{queue:false, duration: 3000}); 
}

function zoomCenter () {
    game.height = window.innerHeight*5/3 + 5;
    game.width = window.innerWidth*5/3 + 5;
    if (screen.width < 1000) {
        $('#message').html("<p>Tilt phone to search for moles.</p><div id='close' onclick='clearMessage()'></div>").show();
    }
    $('#board').animate({height: game.height, width: game.width},{queue:false, duration:2000});
    $('#board').animate({left: -game.width/5, top: -game.height/5},
                        {queue:false, duration:2000, complete: function () {
                            if (screen.width > 1000) {
                                movement = setInterval(moveBoard, 1);
                            } else {
                                window.addEventListener('deviceorientation', setMovement);
                            }
                            $('#stopGame').show();
                            clearMessage();
                            setDimensions();
                        }});
    game.relativeX = -game.width/5;
    game.relativeY = -game.height/5;
}

function startGame () {
    if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission();
    }
    $('#startGame').hide();
    clearMessage();
    removeMoles();
    zoomCenter();
    moles = setInterval(addMoles, 2000);
    game.state = true;
    game.interval = 2000;
    game.score = 0;
    game.moleCount = 0;
    document.getElementById('gameControls').style.top = 0;
    document.getElementById('gameControls').style.left = 0;
}

function stopGame () { 
    $('#stopGame').hide();
    game.state = false; 
    game.userAngle = null;
    game.movementCount = 0;
    zoomFull();
    window.removeEventListener('deviceorientation', setMovement);
    clearInterval(movement);
    clearInterval(moles); 
    $('#gameControls').css('top', '45%');
    $('#gameControls').css('left', 'calc(50% - 16px)');
}

function clearMessage () {
    $('#message').html('').hide();
}