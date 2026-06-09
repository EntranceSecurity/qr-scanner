function showBusy(message){

    document.getElementById(
      "loadingScreen"
    ).style.display = "flex";

    document.querySelector(
      "#loadingScreen .info"
    ).innerText =
    message || "Please wait...";

}

function hideBusy(){

    document.getElementById(
      "loadingScreen"
    ).style.display = "none";

}

function showVerifiedUser(user){

    playSuccess();

    const screen =
    document.getElementById(
      "resultScreen"
    );

    const content =
    document.getElementById(
      "resultContent"
    );

    screen.className =
    "result-screen approved";

    content.innerHTML = `

        <div class="big-status">
        ✓ VERIFIED
        </div>

        <div class="info">
        Unique ID: ${user.id}
        </div>

        <div class="info">
        Name: ${user.name}
        </div>

        <div class="info">
        Facilitator: ${user.facilitator}
        </div>

        <div class="info">
        Passcode: ${user.passcode}
        </div>

        <br>

        <img
        src="https://quickchart.io/qr?text=${encodeURIComponent(user.id)}&size=400"
        style="
            width:280px;
            background:white;
            padding:10px;
            border-radius:12px;
        ">

        <br><br>

        <div class="info">
        Take Screenshot if QR needs re-printing
        </div>

        <br><br>

        <button
        onclick="continueScanning()"
        style="
            padding:16px 40px;
            font-size:22px;
            border:none;
            border-radius:12px;
            background:white;
            color:black;
            font-weight:bold;
            cursor:pointer;
        ">
        CONTINUE
        </button>

    `;

    screen.style.display =
    "flex";

}

function showResult(res){
    if(!res){
        console.error("Empty response");
        return;
    }
    
    hideBusy();
    const screen =
    document.getElementById("resultScreen");

    const content =
    document.getElementById("resultContent");

    if(
       res.status === "APPROVED"
    ){

        playSuccess();

        screen.className =
        "result-screen approved";

        content.innerHTML = `

            <div class="big-status">
            ✓ APPROVED
            </div>

            <div class="info">
            Unique ID: ${res.id}
            </div>

            <div class="info">
            Name: ${res.name}
            </div>

            <div class="info">
            Facilitator: ${res.facilitator}
            </div>

            <div class="info">
            Passcode: ${res.passcode}
            </div>

            <div class="info">
            Authority: ${currentAuthority}
            </div>

            <br><br>

            <button
                onclick="continueScanning()"
                style="
                    padding:16px 40px;
                    font-size:22px;
                    border:none;
                    border-radius:12px;
                    background:white;
                    color:black;
                    font-weight:bold;
                    cursor:pointer;
                ">
                CONTINUE
            </button>

        `;

    }else{

        playFailure();

        screen.className =
        "result-screen denied";

        content.innerHTML = `

            <div class="big-status">
            ✖ DENIED
            </div>
        
            <div class="info">
            Unknown QR Code
            </div>
        
            <div class="info">
            ${res.id}
            </div>
        
            <br><br>
        
            <button
                onclick="continueScanning()"
                style="
                    padding:16px 40px;
                    font-size:22px;
                    border:none;
                    border-radius:12px;
                    background:white;
                    color:black;
                    font-weight:bold;
                ">
                CONTINUE
            </button>
        
        `;

    }

    screen.style.display = "flex";

}

function showUserCreated(res){

    const screen =
    document.getElementById(
      "resultScreen"
    );

    const content =
    document.getElementById(
      "resultContent"
    );

    screen.className =
    "result-screen created";

    content.innerHTML = `

        <div class="big-status">
        ✓ USER CREATED
        </div>

        <div class="info">
        Unique ID
        </div>

        <div class="info"
        style="
            font-size:32px;
            font-weight:bold;
        ">
        ${res.uniqueId}
        </div>

        <br>

        <img
        src="https://quickchart.io/qr?text=${encodeURIComponent(res.uniqueId)}&size=250"
        style="
            background:white;
            padding:10px;
            border-radius:12px;
        ">

        <br><br>

        <div class="info">
        Take screenshot and provide QR to user
        </div>

        <br><br>

        <button
        onclick="continueScanning()"
        style="
            padding:16px 40px;
            font-size:22px;
            border:none;
            border-radius:12px;
            background:white;
            color:black;
            font-weight:bold;
        ">
        CONTINUE
        </button>

    `;

    screen.style.display =
    "flex";

}


