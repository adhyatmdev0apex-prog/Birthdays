const steps=[

{
title:"Initializing Love...",
percent:100
},

{
title:"Loading Memories...",
percent:100
},

{
title:"Collecting Smiles...",
percent:100
},

{
title:"Searching For World's Best Father...",
percent:100
},

{
title:"Identity Verified",
percent:100
},

{
title:"ACCESS GRANTED ❤️",
percent:null
}

];

function makeBar(){

    return `
    <div class="progress">
        <div class="bar"></div>
    </div>
    `;

}

function showStep(i){

    if(i>=steps.length){

        setTimeout(()=>{

            document.getElementById("loading").style.opacity="0";

        },1000);

        setTimeout(()=>{

            document.getElementById("loading").style.display="none";

        },2500);

        return;

    }

    const loading=document.querySelector(".terminal");

    const div=document.createElement("div");

    div.className="bootLine";

    if(i==steps.length-1){

        div.classList.add("gold");

    }

    div.innerHTML=steps[i].title;

    loading.appendChild(div);

    setTimeout(()=>{

        div.classList.add("show");

    },100);

    if(steps[i].percent!=null){

        const wrap=document.createElement("div");

        wrap.innerHTML=makeBar();

        loading.appendChild(wrap);

        const bar=wrap.querySelector(".bar");

        setTimeout(()=>{

            bar.style.width="100%";

        },300);

    }

    setTimeout(()=>{

        showStep(i+1);

    },1800);

}

window.onload=function(){

    showStep(0);

}

function openEnvelope(){

    document.getElementById("flap").style.transform="rotateX(180deg)";

    document.getElementById("letter").style.transform="translateY(-120px)";

    setTimeout(()=>{

        document.getElementById("photos").scrollIntoView({

            behavior:"smooth"

        });

    },1800);

}

const photos=document.querySelectorAll(".polaroid");

photos.forEach(photo=>{

    photo.onclick=function(){

        this.style.transition=".6s";

        this.style.transform="scale(1.25) rotate(0deg)";

        setTimeout(()=>{

            this.style.transform="scale(1)";

        },1200);

    }

});

function cakeClicked(){

const cake=document.getElementById("cake");

cake.style.transform="scale(1.35)";


setTimeout(()=>{

    cake.style.transform="scale(1)";

},600);

document.getElementById("song").play();

document.getElementById("birthdayMessage").style.opacity="1";

for(let i=0;i<80;i++){

    let c=document.createElement("div");

    c.style.position="fixed";

    c.style.left=Math.random()*100+"vw";

    c.style.top="-20px";

    c.style.width="10px";

    c.style.height="18px";

    c.style.background="hsl("+Math.random()*360+",100%,50%)";

    c.style.transform="rotate("+Math.random()*360+"deg)";

    c.style.animation="fall "+(3+Math.random()*3)+"s linear";

    c.style.pointerEvents="none";

    document.body.appendChild(c);

    setTimeout(()=>{

        c.remove();

    },6000);

}

}

function createStars(){


for(let i=0;i<180;i++){

    let s=document.createElement("div");

    s.className="star";

    s.style.left=Math.random()*100+"vw";

    s.style.top=Math.random()*100+"vh";

    s.style.animationDelay=Math.random()*2+"s";

    document.body.appendChild(s);

}


}

createStars();
