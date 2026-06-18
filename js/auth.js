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

            const loginHelp = document.querySelector(
                ".login-help"
            );
            if(loginHelp){
                loginHelp.style.display = "none";
            }

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

function loadAuthoritiesFromData(authorities){

    const ddl =
    document.getElementById("authority");

    const options = [
        '<option value="">Select Security Authority</option>'
    ];

    authorities.forEach(a => {
        options.push(`<option value="${a}">${a}</option>`);
    });

    ddl.innerHTML = options.join("");
}

function loadFacilitatorsFromData(facilitators){

    const addUserDDL =
    document.getElementById(
      "newFacilitator"
    );

    const manualDDL =
    document.getElementById(
      "manualFacilitator"
    );

    if(addUserDDL){

        const options = [
            '<option value="">Select Facilitator</option>'
        ];

        facilitators.forEach(f => {
            options.push(`<option value="${f}">${f}</option>`);
        });

        addUserDDL.innerHTML = options.join("");
    }

    if(manualDDL){

        const options = [
            '<option value="">Select Facilitator</option>'
        ];

        facilitators.forEach(f => {
            options.push(`<option value="${f}">${f}</option>`);
        });

        manualDDL.innerHTML = options.join("");
    }

}

function loadAuthorities(){
    api("authorities", {}, {
        cache: true,
        onCacheStatus: status => {
            setCacheIndicator(status);
        }
    })
    .then(data => {
        loadAuthoritiesFromData(data.authorities || []);
    })
    .catch(err => {
        console.warn("Authority refresh failed", err);
    });
}

function loadFacilitators(){
    api("facilitators", {}, {
        cache: true,
        onCacheStatus: status => {
            setCacheIndicator(status);
        }
    })
    .then(data => {
        loadFacilitatorsFromData(data.facilitators || []);
    })
    .catch(err => {
        console.warn("Facilitator refresh failed", err);
    });
}

