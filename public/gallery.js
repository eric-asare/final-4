function populate(data) {
    for (item in data) {
        let container = document.createElement('div');
        let description = document.createElement('div');
        container.classList.add('gallery');
        description.classList.add('desc');

        description.innerHTML = item.name;

        let img = new Image();
        img.onload = start;
        img.src = item.drawingImg;


        function start() {
            container.body.appendChild(img);
            container.appendChild(description);
        }

    }
}

window.addEventListener("load", function() {

    // fetch("http://localhost:4000/drawingsApi")
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //         // populate(data);
    //     })
})