// when lobby has loaded
window.addEventListener('load', () => {
    let joinForm = document.getElementById('join-form');

    // if game has ended and results stored on session storage
    if (sessionStorage.length) {

        // get game results data
        let userNames = sessionStorage.getItem('userNames');
        let eachUserScores = sessionStorage.getItem('eachUserScores');
        let teamScore = sessionStorage.getItem('teamScore');

        if (eachUserScores) {
            // fill game results popup / div
            let resDiv = document.getElementById('game-results');
            resDiv.style.visibility = 'visible';

            resDiv.innerHTML = ` <p> 🥳 <b>Congrats</b> ${userNames} !</p> <p> 
            <b> Individual Scores:</b> ${eachUserScores} </p> <p> <b>TeamScore:</b> ${teamScore} </p> <p> Want higher team score? <b> Collaborate </b> </p> `
        }

    }

    // else start game
    joinForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let name = document.getElementById('name-input').value;
        let room = document.getElementById('level-select').value;

        console.log(name, room);

        //save the name and the room in session storage
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('room', room);


        //redirect the user to chat.html
        window.location = '/game.html'
    })
})