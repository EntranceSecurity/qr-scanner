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

    html5QrCode =
    new Html5Qrcode("scanner");

    html5QrCode.start(

        { facingMode: "environment" },

        {
            fps:10,
            qrbox:250
        },

        onScanSuccess

    );

    if(scannerWatchdog){
        clearInterval(scannerWatchdog);
    }

    setInterval(async ()=>{

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
                html5QrCode?.isScanning &&
                t1 === t2
            ){

                console.log(
                  "Frozen video detected"
                );

                try{

                    await html5QrCode.stop();

                    await html5QrCode.start(
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

        if(html5QrCode){

            try{
                await html5QrCode.stop();
            }catch(e){}

            await html5QrCode.start(
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

    isProcessing = false;
    lastScan = "";
    lastScanTime = 0;

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

    suggestedUserId = "";

    isProcessing = false;
    lastScan = "";
    lastScanTime = 0;

    document.activeElement?.blur();

    try{

        await restartScanner();
    
    }catch(e){
    
        console.log(e);
    
    }

}

