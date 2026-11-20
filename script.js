fetch("https://api.github.com/users/linalg137/repos")
    .then(response => response.json())
    .then(repos => {

        const container =
            document.getElementById("projects-container");

        repos.forEach(repo => {
            const card = 
                document.createElement("div");

            card.className = "project-card";

            card.innerHTML =`
                <h3>${repo.name}</h3>

                <p>
                    ${repo.description || "no descrpition yet!"}
                </p>

                <a href="${repo.html_url}"
                    target="_blank">
                    view on github~
                    </a>
                 `;

                container.appendChild(card)

             });

        });

let editing = false;

const editButton =
        document.getElementById("editButton");
    
editButton.addEventListener("click",() => {
    editing = !editing;

    const sections = 
        document.querySelectorAll(".editable");

        sections.forEach(section => {
            
            section.contentEditable = editing;

        if (editing){
            section.style.outline =
            "2px dashed rgba(138, 141, 210, 0.5)";
        } else {
            section.style.outline = 
                "none";
        }
    });

    editButton.textContent = 
        editing
            ? "save changes"
            : "edit site"
});

const editableSections =
    document.querySelectorAll(".editable");

editableSections.forEach(section => {
    const saved =
        localStorage.getItem(section.id);
    
    if (saved){
        section.innerHTML = saved;
    }

    section.addEventListener("input",()=>{
        localStorage.setItem(
            section.id,
            section.innerHTML
        );
    });
});

document
.getElementById("resetButton")
.addEventListener("click", ()=> {localStorage.clear(); location.reload();}
);


let doodleMode = false;

const doodleButton =
    document.getElementById("doodleButton");

doodleButton.addEventListener("click",()=>{
    doodleMode = !doodleMode;

    if (doodleMode){
        document.body.style.cursor =
            'url("images/cursor.png"), auto';

        document.body.classList.add("doodling");

        doodleButton.textContent =
            "stop doodling";
    } else {
        document.body.style.cursor =
            "default";
        
        document.body.classList.remove("doodling");

        doodleButton.textContent =
            "doodle!";
    }
});

const canvas =
    document.getElementById("doodleLayer");

const ctx =
    canvas.getContext("2d");

canvas.width= window.innerWidth;
canvas.height= window.innerHeight;

let doodling = false;

document.addEventListener("mousedown", e => {
    if (!doodleMode) return;
    doodling = true;

    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
});

document.addEventListener("mouseup", () => {
    doodling = false;
});


document.addEventListener("mousemove", e => {
    if (!doodleMode) return;
    if (!doodling) return;

    ctx.lineWidth= 3
    ctx.strokeStyle = 
        getComputedStyle(
            document.documentElement
        ) .getPropertyValue(
            "--text"
        );
    ctx.lineCap = "round";

    ctx.lineTo(
        e.clientX,
        e.clientY
    );

    ctx.stroke();
})

const themePicker =
    document.getElementById("themePicker");

function hexToHsl(hex){
    let r = parseInt(hex.slice(1,3),16)/255;

    let g = parseInt(hex.slice(3,5),16)/255;

    let b = parseInt(hex.slice(5,7),16)/255;

    const max =
        Math.max(r,g,b);
    
    const min =
        Math.min(r,g,b);
    
    let h;
    let s;
    let l =
        (max + min)/2;
    
    if(max === min){
        h = 0;
        s = 0;
    } else {
        const d =
            max-min;
        
        s= 
            l> 0.5
            ? d/(2-max-min)
            : d/(max+min);
        
        switch(max){

            case r:
                h =
                    (g-b)/d +
                    (g < b ? 6 : 0);
                break;

            case g:
                h =
                    (b-r)/d + 2;
                break;

            case b:
                h =
                    (r-g)/d + 4;
                break;
        }
        h/= 6;
    }
    return {
        h: Math.round(h*360),
        s: Math.round(s*100),
        l: Math.round(l*100)
    };
}

function applyTheme(color){

    console.log("THEME CHANGED:", color);

    const hsl =
        hexToHsl(color);

    document.documentElement.style
        .setProperty(
            "--theme-hue",
            hsl.h
        );

    document.documentElement.style
        .setProperty(
            "--theme-saturation",
            hsl.s + "%"
        );

    document.documentElement.style
        .setProperty(
            "--theme-lightness",
            hsl.l + "%"
        );

    localStorage.setItem(
        "savedTheme",
        color
    );
}

themePicker.addEventListener(
    "input",
    () => {
        applyTheme(
            themePicker.value
        );
    }
);

const savedTheme = 
    localStorage.getItem(
        "savedTheme"
    );

if(savedTheme){
    themePicker.value =
        savedTheme;
    
    applyTheme(
        savedTheme
    );
}

const starCanvas =
    document.getElementById("starfield");

const starCtx =
    starCanvas.getContext("2d");

starCanvas.width =
    window.innerWidth;

starCanvas.height =
    window.innerHeight;


const stars = [];
const shootingStars = [];

function spawnShootingStar(){
    shootingStars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        speedX: Math.random()*3 + 2,
        speedY: (Math.random()-0.5)*1.2,
        length: Math.random()*150+100
    });
}

for(let i=0; i < 400; i++){
    stars.push({
        x: 
            Math.random()*
            starCanvas.width,
        y:
            Math.random()*
            starCanvas.height,
        size:
            Math.random()* 4 + 1,
        speed:
            Math.random() *0.3 + 0.05
    });
}

function animateStars(){

    starCtx.clearRect(
        0,
        0,
        starCanvas.width,
        starCanvas.height
    );

    const theme = 
    getComputedStyle(
        document.documentElement
    );

    shootingStars.forEach(
        (star,index) => {
            const magnitude = Math.sqrt(star.speedX ** 2 + star.speedY **2);

            const directionX = star.speedX / magnitude;

            const directionY = star.speedY / magnitude;

            starCtx.beginPath();

            starCtx.moveTo(
                star.x, star.y
            );

            starCtx.lineTo(
                star.x- directionX * star.length,
                star.y - directionY * star.length
            );

            const trail = starCtx.createLinearGradient(star.x, star.y, star.x - directionX * star.length, star.y - directionY*star.length);
        
        trail.addColorStop(
            0, theme.getPropertyValue("--text")
        );

        trail.addColorStop(
            1, "transparent"
        );

        starCtx.strokeStyle = trail;
        starCtx.lineWidth = 3;
        starCtx.stroke();
        star.x += star.speedX;
        star.y += star.speedY;

        if(
            star.x < -300 || 
            star.x > starCanvas.width + 300 ||
            star.y < -300 ||
            star.y > starCanvas.height + 300
        ){
            shootingStars.splice(
                index, 1
            );
        }
    }
);



    starCtx.fillStyle = 
        theme.getPropertyValue(
            "--text"
        );
    
    starCtx.shadowBlur = 15;
    starCtx.shadowColor =
        theme.getPropertyValue(
            "--text"
        );

    stars.forEach(star => {
        star.y += star.speed;
        if(star.y > starCanvas.height){
            star.y = 0;
            star.x = 
                Math.random()*
                starCanvas.width;
        }

        starCtx.beginPath();

        starCtx.arc(
                star.x,
                star.y,
                star.size,
                0,
                Math.PI * 2
            );
            starCtx.fill();
    });
    requestAnimationFrame(
        animateStars
    );
}

animateStars();

window.addEventListener(
    "resize",

    () => {
        starCanvas.width = 
            window.innerWidth;
        starCanvas.height = 
            window.innerHeight;
    }
);

const player= 
    document.getElementById("musicPlayer");

const progressBar= 
document.getElementById("progressBar");

player.addEventListener("timeupdate", () => {
    progressBar.value =
        (player.currentTime/player.duration)*100 || 0;
    }
);

progressBar.addEventListener("input", ()=> {
    player.currentTime = (progressBar.value/100)*player.duration;
    }
);

const playerButton =
    document.getElementById( "playButton");

const volumeSlider = document.getElementById("volumeSlider");

playerButton.addEventListener("click", () => {
    if(player.paused){
        player.play();
        playerButton.textContent =
            "❚❚";
    } else {
        player.pause();
        playerButton.textContent =
            "▶"
        }
    }
);

player.addEventListener("ended",() => {playerButton.textContent = "▶"});

volumeSlider.addEventListener(
    "input",

    ()=> {
        player.volume = 
            volumeSlider.value/100;
    }
);

const songTime =
    document.getElementById("songTime");

player.addEventListener(
    "timeupdate", ()=> {
        const progress =
            (player.currentTime/ player.duration)*100;
        
        progressBar.value =
            progress || 0;
        
        const currentMinutes = 
            Math.floor(player.currentTime/60);

        const currentSeconds = Math.floor(player.currentTime % 60);

        const totalMinutes = Math.floor(player.duration / 60) || 0;

        const totalSeconds = Math.floor(player.duration % 60) || 0;
    
        songTime.textContent = `${currentMinutes}:${String(currentSeconds).padStart(2,"0")}
        /
        ${totalMinutes}:${String(totalSeconds).padStart(2,"0")}`;
    });

function timeShootingStar(){
    const delay = Math.random()*2500 + 4000;

    setTimeout(() => {
        spawnShootingStar();
        timeShootingStar();
    }, delay);
}

timeShootingStar();