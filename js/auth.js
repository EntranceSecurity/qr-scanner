/*
--------------------------------------------------
LOGIN
--------------------------------------------------
*/

function loginAndStart(){

    const authority =
    document.getElementById(
      "authority"
    ).value;

    const passcode =
    document.getElementById(
      "passcode"
    ).value;

    if(!authority){

        alert(
          "Select Security Authority"
        );

        return;
    }

    if(!passcode){

        alert(
          "Enter Passcode"
        );

        return;
    }

    showBusy(
      "Authenticating..."
    );

    document
    .getElementById(
      "loginBtn"
    )
    .disabled = true;

    api(
    "login",
    {
        authority,
        passcode
    }
    )
    .then(res => {

        hideBusy();

        document
        .getElementById(
          "loginBtn"
        )
        .disabled = false;

        if(
          res.status ===
          "AUTHORIZED"
        ){
            unlockAudio();

            AppState.currentAuthority =
            authority;

            // Hide login controls

            document
            .getElementById(
              "authority"
            )
            .style.display =
            "none";

            document
            .getElementById(
              "passcode"
            )
            .style.display =
            "none";

            document
            .getElementById(
              "loginBtn"
            )
            .style.display =
            "none";

            // Show post-login buttons

            document
            .getElementById(
              "manualVerifyBtn"
            )
            .style.display =
            "inline-block";

            document
            .getElementById(
              "addUserMainBtn"
            )
            .style.display =
            "inline-block";

            document
            .getElementById(
              "helpBtn"
            )
            .style.display =
            "inline-block";

            // Start scanner

            startScanner();

        }else{

            alert(
              "Invalid Authority Passcode"
            );

        }

    })
    .catch(err => {

        hideBusy();

        document
        .getElementById(
          "loginBtn"
        )
        .disabled = false;

        alert(
          "Login Error: " + err
        );

    });

}

function loadAuthorities(){

    api("authorities")
    .then(data => {

        const ddl =
        document.getElementById("authority");

        ddl.innerHTML =
        '<option value="">Select Security Authority</option>';

        data.authorities.forEach(a => {

            ddl.innerHTML +=
            `<option value="${a}">${a}</option>`;

        });

    });

}

function loadFacilitators(){

    api("facilitators")
    .then(data => {

        const addUserDDL =
        document.getElementById(
          "newFacilitator"
        );

        const manualDDL =
        document.getElementById(
          "manualFacilitator"
        );

        if(addUserDDL){

            addUserDDL.innerHTML =
            '<option value="">Select Facilitator</option>';

            data.facilitators.forEach(f => {

                addUserDDL.innerHTML +=
                `<option value="${f}">${f}</option>`;

            });

        }

        if(manualDDL){

            manualDDL.innerHTML =
            '<option value="">Select Facilitator</option>';

            data.facilitators.forEach(f => {

                manualDDL.innerHTML +=
                `<option value="${f}">${f}</option>`;

            });

        }

    });

}

