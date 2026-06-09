function closeManualVerification(){

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

    document.getElementById(
        "manualModal"
    ).style.display = "none";

}
    
function submitManualVerification(){

    const uniqueId =
    document.getElementById(
        "manualUniqueId"
    ).value.trim();

    const name =
    document.getElementById(
        "manualName"
    ).value.trim();

    const facilitator =
    document.getElementById(
        "manualFacilitator"
    ).value.trim();

    const passcode =
    document.getElementById(
        "manualPasscode"
    ).value.trim();

    closeManualVerification()
    
    showBusy(
      "Verifying User..."
    );

    setTimeout(() => {
        fetch(
            API_URL +
            "?action=manualVerify" +
            "&uniqueId=" + encodeURIComponent(uniqueId) +
            "&name=" + encodeURIComponent(name) +
            "&facilitator=" + encodeURIComponent(facilitator) +
            "&passcode=" + encodeURIComponent(passcode) +
            "&authority=" + encodeURIComponent(currentAuthority)
        )
        .then(r => r.json())
        .then(res => {
    
            hideBusy();
    
            closeManualVerification();
    
            if(res.status === "APPROVED"){

                showVerifiedUser(res);
            
            }
            else if(res.status === "MULTIPLE_MATCHES"){

                showMultipleMatches(res);
            
            }
            else{
    
                showResult(res);
    
            }
    
        })
        .catch(err => {
    
            hideBusy();
            alert(
              "Verification Error: " + err
            );
    
        });
    }, 50);

}

function showMultipleMatches(res){

    window.multipleMatches = res.matches;

    const screen =
    document.getElementById(
      "resultScreen"
    );

    screen.className =
    "result-screen approved";

    let html = `
        <div class="big-status">
        MULTIPLE MATCHES
        </div>

        <div class="info">
        Select the correct user
        </div>

        <br>
    `;

    res.matches.forEach((user,index) => {

        html += `
            <button
            style="
                width:90%;
                margin:10px;
                padding:20px;
                font-size:18px;
                background:white;
                color:black;
                border-radius:12px;
            "
            onclick="selectMatchedUser(${index})">
                <b>${user.name}</b><br>
                ${user.id}
            </button>
        `;

    });

    html += `
        <br>
        <button
        onclick="continueScanning()">
        CANCEL
        </button>
    `;

    document.getElementById(
      "resultContent"
    ).innerHTML = html;

    screen.style.display =
    "flex";

}

function selectMatchedUser(index){

    const user =
    window.multipleMatches[index];

    showBusy(
      "Confirming User..."
    );

    fetch(
        API_URL +
        "?action=confirmManualMatch" +
        "&uniqueId=" +
        encodeURIComponent(user.id) +
        "&authority=" +
        encodeURIComponent(currentAuthority)
    )
    .then(r => r.json())
    .then(res => {

        hideBusy();

        showVerifiedUser(res);

    })
    .catch(err => {

        hideBusy();

        alert(
          "Verification Error: " + err
        );

    });

}

function openManualVerification(){

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

    document.getElementById(
        "manualModal"
    ).style.display = "block";

}

function onScanSuccess(decodedText){
    console.log(
      "SCAN DETECTED",
      decodedText
    );
    if(isProcessing) return;

    const now = Date.now();

    if(
        decodedText === lastScan &&
        (now - lastScanTime) < 3000
    ){
        return;
    }

    lastScan = decodedText;
    lastScanTime = now;

    isProcessing = true;
    if(navigator.vibrate){
        navigator.vibrate(50);
    }
    showBusy(
      "Verifying QR Code..."
    );
    
    const startTime = performance.now();
    
    fetch(
        API_URL +
        "?action=scan" +
        "&id=" + encodeURIComponent(decodedText.trim()) +
        "&authority=" + encodeURIComponent(currentAuthority)
    )
    .then(r => r.json())
    .then(res => {
    
        console.log(
            "API Time:",
            Math.round(
                performance.now() - startTime
            ) + " ms"
        );
    
        showResult(res);
    
    })
    .catch(err => {
    
        alert("Scan Error: " + err);
    
        isProcessing = false;
    
    });

}
