function openAddUserModal(){
    if(html5QrCode?.isScanning){

        html5QrCode.pause(true);
    
    }
    suggestedUserId = "";

    document.getElementById(
      "generatedId"
    ).innerHTML = "";

    document.getElementById(
      "newName"
    ).value = "";

    document.getElementById(
      "newGender"
    ).value = "";

    document.getElementById(
      "newAge"
    ).value = "";

    document.getElementById(
      "newPasscode"
    ).value = "";

    document.getElementById(
      "createUserBtn"
    ).disabled = true;

    document.getElementById(
      "createUserBtn"
    ).style.opacity = "0.5";

    document.getElementById(
      "addUserModal"
    ).style.display = "block";

}

function closeAddUserModal(){

    document.getElementById(
      "newName"
    ).value = "";

    document.getElementById(
      "newFacilitator"
    ).value = "";

    document.getElementById(
      "newPasscode"
    ).value = "";

    if(
      document.getElementById(
        "newGender"
      )
    ){
        document.getElementById(
          "newGender"
        ).value = "";
    }

    if(
      document.getElementById(
        "newAge"
      )
    ){
        document.getElementById(
          "newAge"
        ).value = "";
    }

    document.getElementById(
      "addUserModal"
    ).style.display = "none";

    try{

        if(html5QrCode?.isScanning){

            html5QrCode.resume();

        }

    }catch(e){

        console.log(e);

    }

}

    
function generateUserId(){

    const name =
    document.getElementById(
      "newName"
    ).value.trim();

    const facilitator =
    document.getElementById(
      "newFacilitator"
    ).value.trim();

    const gender =
    document.getElementById(
      "newGender"
    ).value.trim();

    const age =
    document.getElementById(
      "newAge"
    ).value.trim();

    const passcode =
    document.getElementById(
      "newPasscode"
    ).value.trim();

    if(
      !name ||
      !facilitator ||
      !gender ||
      !age ||
      !passcode
    ){

        alert(
          "Please complete all fields."
        );

        return;

    }

    document.getElementById(
      "generateIdBtn"
    ).disabled = true;

    showBusy(
      "Checking existing registrations..."
    );

    fetch(
      API_URL +
      "?action=checkDuplicateUser" +
      "&name=" +
      encodeURIComponent(name) +
      "&facilitator=" +
      encodeURIComponent(facilitator) +
      "&passcode=" +
      encodeURIComponent(passcode)
    )
    .then(r => r.json())
    .then(dupRes => {

        if(
          dupRes.matches &&
          dupRes.matches.length > 0
        ){

            let msg =
            "Possible existing registrations found:\n\n";

            dupRes.matches.forEach(m => {

                msg +=
                m.name +
                " (" +
                m.id +
                ")\n";

            });

            msg +=
            "\nContinue creating a new registration?";

            hideBusy();

            const proceed =
            confirm(msg);

            if(!proceed){

                document.getElementById(
                  "generateIdBtn"
                ).disabled = false;

                return;
            }
        }

        showBusy(
          "Generating User ID..."
        );

        fetch(
          API_URL +
          "?action=generateUserId" +
          "&name=" +
          encodeURIComponent(name) +
          "&facilitator=" +
          encodeURIComponent(facilitator)
        )
        .then(r => r.json())
        .then(res => {

            console.log(res);

            hideBusy();

            document.getElementById(
              "generateIdBtn"
            ).disabled = false;

            if(!res.uniqueId){

                alert(
                  res.error ||
                  "Unable to generate ID"
                );

                return;
            }

            suggestedUserId =
            res.uniqueId;

            document
            .getElementById(
              "generatedId"
            )
            .innerHTML = `
                <h3>
                Generated ID
                </h3>

                <div style="
                    font-size:24px;
                    font-weight:bold;
                    color:#0f9d58;
                ">
                    ${res.uniqueId}
                </div>
            `;

            document
            .getElementById(
              "createUserBtn"
            )
            .disabled = false;

            document
            .getElementById(
              "createUserBtn"
            )
            .style.opacity = "1";

        });

    })
    .catch(err => {

        hideBusy();

        document.getElementById(
          "generateIdBtn"
        ).disabled = false;

        alert(
          "Error: " + err
        );

    });

}

function createUser(){
    const age =
    parseInt(
      document.getElementById(
        "newAge"
      ).value,
      10
    );

    if(
      isNaN(age) ||
      age <= 5
    ){

        alert(
          "Users aged 5 years or below need not be registered."
        );

        return;
    }

    document.getElementById(
      "createUserBtn"
    ).disabled = true;

    showBusy(
      "Creating User..."
    );

    fetch(
      API_URL +
      "?action=addUser" +
      "&uniqueId=" +
      encodeURIComponent(
        suggestedUserId
      ) +
      "&name=" +
      encodeURIComponent(
        document.getElementById(
          "newName"
        ).value
      ) +
      "&gender=" +
      encodeURIComponent(
        document.getElementById(
          "newGender"
        ).value
      ) +
      "&age=" +
      encodeURIComponent(
        document.getElementById(
          "newAge"
        ).value
      ) +
      "&facilitator=" +
      encodeURIComponent(
        document.getElementById(
          "newFacilitator"
        ).value
      ) +
      "&passcode=" +
      encodeURIComponent(
        document.getElementById(
          "newPasscode"
        ).value
      )
    )
    .then(r => r.json())
    .then(res => {
        hideBusy();

        document.getElementById(
          "createUserBtn"
        ).disabled = false;

        if(res.status !== "CREATED"){

            alert(
              res.error ||
              "User creation failed"
            );

            return;

        }
        playCreated();
        
        closeAddUserModal();
        
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
            ${res.uniqueId}
            </div>

            <br>

            <img
            src="https://quickchart.io/qr?text=${encodeURIComponent(res.uniqueId)}&size=400"
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

    })
    .catch(err => {

        hideBusy();

        document.getElementById(
          "createUserBtn"
        ).disabled = false;

        alert(
          "Error: " + err
        );

    });

}


