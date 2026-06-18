function showBusy(message, delay = 120){
    if(AppState.busyTimeout){
        clearTimeout(AppState.busyTimeout);
    }

    AppState.busyTimeout = setTimeout(() => {
        document.getElementById(
          "loadingScreen"
        ).style.display = "flex";

        document.querySelector(
          "#loadingScreen .info"
        ).innerText =
        message || "Please wait...";

        AppState.busyTimeout = null;
    }, delay);
}

function hideBusy(){
    if(AppState.busyTimeout){
        clearTimeout(AppState.busyTimeout);
        AppState.busyTimeout = null;
    }

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

        <button        onclick="printCurrentScreen()"
        style=
            "padding:16px 40px;
            font-size:22px;
            border:none;
            border-radius:12px;
            background:#f1f1f1;
            color:black;
            font-weight:bold;
            cursor:pointer;
            margin-right:10px;
        ">
        PRINT
        </button>
        <button        onclick="continueScanning()"
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
            Authority: ${AppState.currentAuthority}
            </div>

            <br><br>

            <button
                onclick="printCurrentScreen()"
                style="
                    padding:16px 40px;
                    font-size:22px;
                    border:none;
                    border-radius:12px;
                    background:#f1f1f1;
                    color:black;
                    font-weight:bold;
                    cursor:pointer;
                    margin-right:10px;
                ">
                PRINT
            </button>
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


function showUserCreated(uniqueId){

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

        <div
        style="
          font-size:28px;
          font-weight:bold;
          margin-top:10px;
        ">
        ${uniqueId}
        </div>

        <br>

        <img
        src="https://quickchart.io/qr?text=${encodeURIComponent(uniqueId)}&size=400"
        style="
          width:280px;
          background:white;
          padding:10px;
          border-radius:12px;
        ">

        <br><br>

        <div class="info">
        Take Screenshot and provide QR to user
        </div>

        <br><br>

        <button
        onclick="printCurrentScreen()"
        style="
            padding:16px 40px;
            font-size:22px;
            border:none;
            border-radius:12px;
            background:#f1f1f1;
            color:black;
            font-weight:bold;
            cursor:pointer;
            margin-right:10px;
        ">
        PRINT
        </button>
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

function showMultipleMatches(res){

    AppState.multipleMatches = res.matches;

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