function playSuccess(){

    const ctx = getAudioContext();

    if(ctx.state === "suspended"){
        ctx.resume();
    }
    
    const osc =
    ctx.createOscillator();

    const gain =
    ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 900;

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.value = 0.3;

    osc.start();

    osc.stop(
        ctx.currentTime + 0.15
    );

}

/*
--------------------------------------------------
FAILURE ALARM
--------------------------------------------------
*/

function playFailure(){

    const ctx =
    getAudioContext();
    
    if(ctx.state === "suspended"){
        ctx.resume();
    }

    [0,0.25,0.5].forEach(offset => {

        const osc =
        ctx.createOscillator();

        const gain =
        ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.value = 750;

        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(
            0.4,
            ctx.currentTime + offset
        );

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + offset + 0.18
        );

        osc.start(
            ctx.currentTime + offset
        );

        osc.stop(
            ctx.currentTime + offset + 0.18
        );

    });

}

/*
--------------------------------------------------
SUCCESS BEEP
--------------------------------------------------
*/
function playCreated(){

    const ctx =
    getAudioContext();

    if(ctx.state === "suspended"){
        ctx.resume();
    }
    
    const notes =
    [523,659,784];

    notes.forEach((freq,index)=>{

        const osc =
        ctx.createOscillator();

        const gain =
        ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(
            0.25,
            ctx.currentTime + index * 0.12
        );

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            ctx.currentTime + index * 0.12 + 0.18
        );

        osc.start(
            ctx.currentTime + index * 0.12
        );

        osc.stop(
            ctx.currentTime + index * 0.12 + 0.18
        );

    });

}

async function unlockAudio(){

    const ctx = getAudioContext();

    if(ctx.state === "suspended"){

        try{
            await ctx.resume();
        }catch(e){
            console.log(e);
        }

    }

}

function getAudioContext(){

    if(!audioCtx){

        audioCtx =
        new(
            window.AudioContext ||
            window.webkitAudioContext
        )();

    }

    return audioCtx;

}
