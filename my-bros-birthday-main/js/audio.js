/*=========================================================
                AUDIO ENGINE
=========================================================*/

function playBirthdaySong(){

    const audio = document.getElementById("birthdaySong");

    if(!audio) return;

    audio.volume = 0.7;

    audio.play().catch(() => {
        /* autoplay blocked â€” user gesture already happened so this shouldn't fire */
    });

}

function fadeOutPianoThenPlayBirthday(){

    const piano = document.getElementById("piano");

    if(!piano || piano.paused || piano.ended){
        playBirthdaySong();
        return;
    }

    const startVolume = piano.volume;
    const steps = 10;
    let currentStep = 0;

    const fade = setInterval(() => {
        currentStep++;
        piano.volume = Math.max(0, startVolume * (1 - currentStep / steps));

        if(currentStep >= steps){
            clearInterval(fade);
            piano.pause();
            piano.volume = startVolume;
            playBirthdaySong();
        }
    }, 100);

}

function stopBirthdaySong(){

    const audio = document.getElementById("birthdaySong");

    if(!audio) return;

    audio.pause();
    audio.currentTime = 0;

}

function fadeOutBirthdaySong(){

    const audio = document.getElementById("birthdaySong");

    if(!audio || audio.paused) return;

    const startVolume = audio.volume;
    const steps = 10;
    let currentStep = 0;

    const fade = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(0, startVolume * (1 - currentStep / steps));

        if(currentStep >= steps){
            clearInterval(fade);
            audio.pause();
            audio.currentTime = 0;
            audio.volume = startVolume;
        }
    }, 100);

}

function playPiano(){

    const audio = document.getElementById("piano");

    if(!audio){
        console.log("Piano element missing");
        return;
    }

    audio.currentTime = 0;
    audio.volume = 0.7;
    audio.loop = false;
    audio.muted = false;

    audio.play()
    .then(()=>{
        console.log("Piano playing");
    })
    .catch(err=>{
        console.error("Piano failed", err);
    });
}

function primePiano(){

    const audio = document.getElementById("piano");

    if(!audio || !audio.paused) return;

    audio.muted = true;
    audio.volume = 0;
    audio.loop = false;
    audio.play().catch(() => {});

}

document.addEventListener("pointerdown", primePiano, { once:true });

function stopPiano(){

    const audio = document.getElementById("piano");

    if(!audio) return;

    audio.pause();
    audio.currentTime = 0;

}
