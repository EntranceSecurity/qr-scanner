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
        api(
            "manualVerify",
            {
                uniqueId,
                name,
                facilitator,
                passcode,
                authority:
                    AppState.currentAuthority
            }
        )
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

function selectMatchedUser(index){

    const user =
    AppState.multipleMatches[index];

    showBusy(
      "Confirming User..."
    );

    api(
        "confirmManualMatch",
        {
            uniqueId: user.id,
            authority:
                AppState.currentAuthority
        }
    )
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
