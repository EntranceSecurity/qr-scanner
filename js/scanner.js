/*
--------------------------------------------------
START SCANNER
--------------------------------------------------
*/

async function startScanner(){

    document.getElementById(
      "scanner"
    ).style.display = "block";

    document.getElementById(
      "authority"
    ).disabled = true;

    document.getElementById(
      "passcode"
    ).disabled = true;

    AppState.html5QrCode =
    new Html5Qrcode("scanner");

    AppState.html5QrCode.start(

        { facingMode: "environment" },

        {
            fps:10,
            qrbox:250
        },

        onScanSuccess

    );

    if(AppState.scannerWatchdog){
        clearInterval(AppState.scannerWatchdog);
    }

    AppState.scannerWatchdog = setInterval(async ()=>{
        try{
            const video =
            document.querySelector(
            "#scanner video"
            );

            if(!video) return;

            const t1 =
            video.currentTime;

            setTimeout(async ()=>{

                if(!video) return;

                const t2 =
                video.currentTime;

                if(
                    AppState.html5QrCode?.isScanning &&
                    t1 === t2
                ){

                    console.log(
                    "Frozen video detected"
                    );

                    try{

                        await AppState.html5QrCode.stop();

                        await AppState.html5QrCode.start(
                            {
                                facingMode:"environment"
                            },
                            {
                                fps:10,
                                qrbox:250
                            },
                            onScanSuccess
                        );

                    }catch(err){

                        console.log(err);

                    }

                }

            },3000);

        }catch(err){

            console.log(err);

        }

    },30000);
}


async function restartScanner(){

    try{

        if(AppState.html5QrCode){

            try{
                await AppState.html5QrCode.stop();
            }catch(e){}

            await AppState.html5QrCode.start(
                {
                    facingMode:"environment"
                },
                {
                    fps:10,
                    qrbox:250
                },
                onScanSuccess
            );

        }

    }catch(err){

        console.log(
          "Restart scanner failed",
          err
        );

    }

    AppState.isProcessing = false;
    AppState.lastScan = "";
    AppState.lastScanTime = 0;

}

async function continueScanning(){

    document.getElementById(
      "resultScreen"
    ).style.display = "none";

    document.getElementById(
      "resultContent"
    ).innerHTML = "";

    // Manual Verification

    document.getElementById(
      "manualUniqueId"
    ).value = "";

    document.getElementById(
      "manualName"
    ).value = "";

    document.getElementById(
      "manualFacilitator"
    ).value = "";

    document.getElementById(
      "manualPasscode"
    ).value = "";

    // Add User

    document.getElementById(
      "newName"
    ).value = "";

    document.getElementById(
      "newFacilitator"
    ).value = "";

    document.getElementById(
      "newPasscode"
    ).value = "";

    if(document.getElementById("newGender")){
        document.getElementById(
          "newGender"
        ).value = "";
    }

    if(document.getElementById("newAge")){
        document.getElementById(
          "newAge"
        ).value = "";
    }

    if(document.getElementById("generatedId")){
        document.getElementById(
          "generatedId"
        ).innerHTML = "";
    }

    AppState.suggestedUserId = "";

    AppState.isProcessing = false;
    AppState.lastScan = "";
    AppState.lastScanTime = 0;

    document.activeElement?.blur();

    try{

        await restartScanner();
    
    }catch(e){
    
        console.log(e);
    
    }

}

function onScanSuccess(decodedText){

    console.log(
      "SCAN DETECTED",
      decodedText
    );

    if(AppState.isProcessing) return;

    const now = Date.now();

    if(
        decodedText.trim() === AppState.lastScan &&
        (now - AppState.lastScanTime) < 3000
    ){
        return;
    }

    AppState.lastScan = decodedText.trim();
    AppState.lastScanTime = now;

    AppState.isProcessing = true;

    if(navigator.vibrate){
        navigator.vibrate(50);
    }

    showBusy(
      "Verifying QR Code..."
    );

    const startTime =
    performance.now();

    const decodedId = decodedText.trim();

    const cachedRes = verifyUserOffline(decodedId);
    if (cachedRes) {
        hideBusy();
        showResult(cachedRes);
        return;
    }

    api(
        "scan",
        {
            id: decodedId,

            authority:
            AppState.currentAuthority
        }
    )
    .then(res => {

        console.log(
            "API Time:",
            Math.round(
                performance.now() -
                startTime
            ) + " ms"
        );

        showResult(res);

    })
    .catch(err => {

        hideBusy();

        alert(
          "Scan Error: " +
          err
        );

        AppState.isProcessing = false;

    });

}
