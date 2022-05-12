const colorCode = ['red', 'black']
const backgroundCode = ['black', 'red']


let canDraw = 'no';
let thickNess = 10;
let whoShouldDraw = "";

let myp5;

// variables to store current drawings and users
let pastDrawings = []
let pastUsers = []


//variables to store the color of each user's crayon
let or, og, ob = 10;
let r, g, b = 10;


// client connects to the server
let socket = io();



//confirm that the client is connected
socket.on('connect', () => {


    console.log('connected to the server');
    // now that client has connected to server, emit name and room information
    let data = {
        'name': sessionStorage.getItem('name'),
        'room': sessionStorage.getItem('room')
    }
    socket.emit('userData', data);
})

// limiting number of people in room to 2
socket.on('maxUsersReached', () => {
    alert('This room is full. Please go back and try to join another room');

    document.getElementById("game-form").innerHTML = ""

})


// telling first user to join room to wait for game partner
socket.on('firstUserJoined', () => {
    alert('Hey! Be patient as your drawing partner joins');
})


// telling the team to begin playing the game
socket.on('secondUserJoined', (data) => {
    let welcomeMessage = data.msg;
    alert(welcomeMessage);
})


// listening on game data
socket.on('gameResults', (gameResults) => {
    console.log(gameResults);
    //save the name and the game results in session storage
    sessionStorage.setItem('userNames', gameResults.userNames);
    sessionStorage.setItem('eachUserScores', gameResults.eachUserScores);
    sessionStorage.setItem('teamScore', gameResults.teamScore);


    //redirect the user to lobby
    window.location = './index.html'
})


// start recall stage
socket.on('startRecall', () => {

    let timeLeft = 60;
    let elem = document.getElementById("game-timer");
    var timerId = setInterval(countdown, 1000);

    function countdown() {
        if (timeLeft == -1) {

            clearTimeout(timerId);
            // emit to socket gameOver when timer runs out
            socket.emit('gameOver');

        } else {
            if (isDigit(timeLeft)) {
                elem.innerHTML = '00:0' + timeLeft;
            } else {
                elem.innerHTML = '00:' + timeLeft;
            }

            timeLeft--;
        }
    }
})


socket.on('endDraw', (nameData) => {
    let canvas = document.getElementById('defaultCanvas0');
    document.body.innerHTML = " ";

    let description = document.createElement('div');
    description.classList.add('desc');
    description.innerHTML = "Nice Art! " + nameData.name;


    let thankyou = document.createElement('div');
    thankyou.innerHTML = "Thank you!";


    // let button = document.createElement('button');
    // button.classList.add('back-home');
    // button.innerHTML = "Back to Homepage";
    // button.style.visibility = "visible";

    document.body.appendChild(canvas);
    document.body.appendChild(description);
    document.body.appendChild(thankyou);


    // document.body.appendChild(button);

})




function drawSetup() {
    console.log("How many times I am called")

    const s = (sketch) => {

        let c = "black";

        sketch.setup = () => {
            sketch.createCanvas(0.7 * window.innerWidth, 400);
            sketch.background(205);
            // if new user joins, show old drawings
            if (pastDrawings.length > 0) {

                for (let i = 0; i < pastDrawings.length; i++) {
                    let data = pastDrawings[i];
                    sketch.fill(data.red, data.green, data.blue);
                    sketch.ellipse(data.x, data.y, data.size, data.size);
                }
            }
        }

        sketch.draw = () => {

            if (sketch.mouseIsPressed) {
                //mouse data
                let mousePos = {
                    x: sketch.mouseX,
                    y: sketch.mouseY,
                    px: sketch.pmouseX,
                    py: sketch.pmouseY,
                    color: c,
                    thickness: thickNess
                };



                let currentname = document.getElementById("user-name").innerHTML;



                if (canDraw == "yes" && whoShouldDraw == currentname) {
                    console.log(whoShouldDraw);
                    socket.emit('mousePositionData', mousePos);

                } else {
                    console.log("Data Not Sent");
                }



            }

            sketch.noStroke();
            //draw the first button
            sketch.fill("red");
            sketch.rect(0, 0, 40, 40);

            //draw the second button
            sketch.fill("blue");
            sketch.rect(40, 0, 40, 40);


            let currentname = document.getElementById("user-name").innerHTML;

            // listen for mouseData from server
            socket.on('mouseDataFromServer', (data) => {
                // console.log(data);
                sketch.stroke(data.color);
                sketch.line(data.x, data.y, data.px, data.py);
                sketch.strokeWeight(data.thickness);
            })

            // listen for mouseData from server
            socket.on('userNameArrived', (data) => {
                whoShouldDraw = data.name;
            })


        }

        //this will run whenever the mouse is pressed
        sketch.mousePressed = () => {
            if (sketch.mouseX > 0 && sketch.mouseX < 40 && sketch.mouseY > 0 && sketch.mouseY < 40) {
                //set the variables to random values
                c = "red";
            }
            if (sketch.mouseX > 40 && sketch.mouseX < 80 && sketch.mouseY > 0 && sketch.mouseY < 40) {
                //set the variables to random values
                c = "blue";
            }
        }






        // sketch.setup = () => {
        //     sketch.createCanvas(0.7 * window.innerWidth, 400);
        //     // make draw happen only once
        //     sketch.noLoop();
        // };



        // sketch.draw = () => {
        //     r = sketch.random(0, 255);
        //     g = sketch.random(0, 255);
        //     b = sketch.random(0, 255);

        //     or = r;
        //     og = g;
        //     ob = b;
        //     sketch.background(220);
        //     sketch.cursor("url('https://cdn.glitch.global/0eb5240b-2b7e-4fe8-8441-a41b1d3f2fb3/crayon.png?v=1648696864063'), auto");
        // };


        // //emit information of mouse positon everytime mouse is moved
        // sketch.mouseDragged = () => {

        //     if (canDraw == "yes") {

        //         let canvas = document.getElementById('defaultCanvas0');

        //         let eraserButton = document.getElementById('eraser');
        //         let pencilButton = document.getElementById('crayon');

        //         eraserButton.addEventListener('click', () => {

        //             // toggle between eraser and pencil button
        //             eraserButton.style.visibility = 'hidden';
        //             pencilButton.style.visibility = 'visible';

        //             // erasing colour 
        //             r = 220;
        //             b = 220;
        //             g = 220;


        //             // change mouse pointer to an eraser
        //             canvas.style.cursor = "url('https://cdn.glitch.global/0eb5240b-2b7e-4fe8-8441-a41b1d3f2fb3/eraser.png?v=1648696864063'), auto";
        //         })



        //         pencilButton.addEventListener('click', () => {

        //             // toggle between eraser and pencil button
        //             eraserButton.style.visibility = 'visible';
        //             pencilButton.style.visibility = 'hidden';

        //             // old crayon colours
        //             r = or;
        //             g = og;
        //             b = ob;
        //             s = thickNess;

        //             // change mouse pointer to crayon
        //             canvas.style.cursor = "url('https://cdn.glitch.global/0eb5240b-2b7e-4fe8-8441-a41b1d3f2fb3/crayon.png?v=1648696864063'), auto";
        //         })


        //         // mouse data
        //         let mousePos = {
        //             x: sketch.round(sketch.mouseX),
        //             y: sketch.round(sketch.mouseY),
        //             red: r,
        //             blue: b,
        //             green: g,
        //             size: thickNess
        //         };

        //         console.log(mousePos);

        //         //emit mouse information to server
        //         socket.emit('mousePositionData', mousePos);

        //         // listen for mouseData from server
        //         socket.on('mouseDataFromServer', (data) => {

        //             sketch.fill(data.red, data.green, data.blue);
        //             sketch.ellipse(data.x, data.y, data.size, data.size);

        //         })

        //     }
        // }
    };

    let myp5 = new p5(s);
}

socket.on('whosTurn', (nameData) => {

    canDraw = "yes";
    let userNames = nameData.usernames;

    // update individual score
    let currentname = document.getElementById("user-name").innerHTML;
    let turnVariable = 1;

    let timeLeft = 60;
    let elem = document.getElementById("game-timer");
    var timerId = setInterval(countdown, 1000);


    let turnInfo = document.getElementById("turns-timer");

    function countdown() {
        if (timeLeft == -1) {

            // tell server, drawing is over
            let jpgQuality = 0.60;
            let canvas = document.getElementById('defaultCanvas0');
            let theDataURL = canvas.toDataURL('image/jpeg', jpgQuality);

            imgData = {
                URL: theDataURL
            }

            socket.emit('drawOver', imgData);


        } else {
            // show correct time
            if (timeLeft % 10 == 0) {
                turnVariable = 1 - turnVariable
                turnInfo.classList.add('vibrate-1');
                nameData = {
                    name: userNames[turnVariable]
                }
                socket.emit('turnUserName', nameData);
            }

            turnInfo.innerHTML = userNames[turnVariable] + "'s Turn";
            turnInfo.style.color = colorCode[turnVariable];
            turnInfo.style.backgroundColor = backgroundCode[turnVariable];


            //show the tools


            // if (userNames[turnVariable] == currentname) {
            //     document.querySelector(".tool__erase").style.visibility = 'visible';
            //     document.querySelector(".tool__draw").style.visibility = 'visible';
            // } else {
            //     document.querySelector(".tool__erase").style.visibility = 'hidden';
            //     document.querySelector(".tool__draw").style.visibility = 'hidden';
            // }


            if (isDigit(timeLeft)) {
                elem.innerHTML = '00:0' + timeLeft;
            } else {
                elem.innerHTML = '00:' + timeLeft;
            }

            timeLeft--;
        }
    }








    // if (drawStatus == 101) {

    //     let timeLeft = 15;
    //     let elem = document.getElementById("turns-timer");
    //     let timerId = setInterval(countdown, 1000);

    //     function countdown() {
    //         if (timeLeft == -1) {
    //             //keep asking whose turn
    //             elem.innerHTML = '00:00';

    //             // socket.emit('turnsLogic');

    //         } else if (drawStatus == "drawOver") {
    //             elem.innerHTML = '00:00';
    //             socket.emit('drawOver');
    //         } else {
    //             // show correct time
    //             if (isDigit(timeLeft)) {
    //                 elem.innerHTML = currentUserName + ':' + '00:0' + timeLeft;
    //             } else {
    //                 elem.innerHTML = currentUserName + ':' + '00:' + timeLeft;
    //             }

    //             timeLeft--;
    //         }
    //     }
    // } else {
    //     socket.emit('drawTimeOver');
    // }

})


// alert the information
socket.on('modeInfo', (modeInfoData) => {
    document.getElementById('instruction').innerHTML = modeInfoData.info;
    socket.emit('turnsLogic');

    // alert(modeInfoData.info);
})




// receive draw data from server
socket.on('drawBegins', (drawData) => {
    drawMode = drawData.mode;

    // console.log(drawMode);


    document.getElementById('challenge').style.visibility = 'hidden';

    document.querySelector('.game-memory-timer').style.visibility = 'visible';


    let data = {
        mode: drawMode
    }

    socket.emit('getDrawMode', data);

})

// get progress data (game stats) and show on game window
socket.on('currentScore', (progressData) => {

    let userName = "<span style='color: " + progressData.nameColor + ";'>" + progressData.name + "</span>"
    let separator = "<span style='color: " + 'white' + ";'>" + ": " + "</span>"
    let word = "<span style='color: " + progressData.color + ";'>" + progressData.data + "</span>"

    let spans = [userName, separator, word];

    let texthtml = spans.join(" ");

    let paragraph = document.createElement('p');
    paragraph.classList.add("word-background");

    paragraph.innerHTML = texthtml;

    let gameWindow = document.getElementById('game-box-msgs');

    gameWindow.appendChild(paragraph);

    // automatic scroll if we type more
    gameWindow.scrollTop = gameWindow.scrollHeight;


    // add data to window screen and score to total score
    let gameScore = document.getElementById('game-score');
    gameScore.innerHTML = progressData.score;


    // update individual score
    let currentname = document.getElementById("user-name").innerHTML;

    if (currentname == progressData.name) {
        document.getElementById("user-score").innerHTML = progressData.namedScore;
    }

    // show words left
    let wordsDisplay = document.getElementById('game-words-left');
    wordsDisplay.style.visibility = 'visible';

    // update words left
    let wordsLeft = document.getElementById('words-left');
    wordsLeft.innerHTML = progressData.wordsLeft;


})



window.addEventListener('load', () => {
    //get username and show on game page
    let userName = document.getElementById('user-name');
    userName.innerHTML = sessionStorage.getItem('name');

    drawSetup();

    // // get game level and show on game page
    let gameLevel = document.getElementById('game-header-msg')
    gameLevel.innerHTML = "Studio: " + sessionStorage.getItem('room').toUpperCase();


    // listen for mode button and emit data

    let challengeButton = document.getElementById('challenge');


    challengeButton.addEventListener('click', () => {

        data = {
            mode: "challenge"
        }



        socket.emit('drawStart', data);
    })

    // document.querySelector('.back-home').addEventListener('click', () => {
    //     console.log('fired');
    //     window.location = "./index.html";
    // })




    // send words that you remember
    // let gameForm = document.getElementById('game-form');

    // gameForm.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     let name = sessionStorage.getItem('name');
    //     let word = document.getElementById('word-input').value;
    //     // console.log(name, word);

    //     //emit the information to the server
    //     wordObject = {
    //         'name': name,
    //         'word': word
    //     }

    //     // emit user's name and his or her word input
    //     socket.emit('wordInput', wordObject);

    //     // clear input after sending
    //     document.getElementById('word-input').value = " ";
    // })

})






function isDigit(val) {
    return String(+val).charAt(0) == val;
}


// function to draw ellipses

// function drawEllipseWithData(data) {
//     myp5.fill(data.red, data.green, data.blue);
//     myp5.ellipse(data.x, data.y, data.size, data.size);
// }



// listen for past Drawings data from server
socket.on('pastDrawings', (data) => {
    pastDrawings = data.oldDrawings
})

// listen for past Users data from server
socket.on('pastUsers', (usersData) => {
    pastUsers = usersData.oldUsers;
})