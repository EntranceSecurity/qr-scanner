function getAddUserData() {

    return {

        name:
            document.getElementById("newName")
            .value.trim(),

        gender:
            document.getElementById("newGender")
            .value.trim(),

        age:
            document.getElementById("newAge")
            .value.trim(),

        facilitator:
            document.getElementById("newFacilitator")
            .value.trim(),

        passcode:
            document.getElementById("newPasscode")
            .value.trim()

    };

}

function resetAddUserForm() {

    document.getElementById("newName").value = "";
    document.getElementById("newGender").value = "";
    document.getElementById("newAge").value = "";
    document.getElementById("newFacilitator").value = "";
    document.getElementById("newPasscode").value = "";

    document.getElementById("generatedId").innerHTML = "";

    document.getElementById("createUserBtn").disabled = true;
    document.getElementById("createUserBtn").style.opacity = "0.5";

    AppState.suggestedUserId = "";

}

function openAddUserModal() {

    try {

        if (AppState.html5QrCode?.isScanning) {

            AppState.html5QrCode.pause(true);

        }

    } catch (e) {

        console.log(e);

    }

    resetAddUserForm();

    document.getElementById(
        "addUserModal"
    ).style.display = "block";

}


async function closeAddUserModal() {

    resetAddUserForm();

    document.getElementById(
        "addUserModal"
    ).style.display = "none";

    try {

        await restartScanner();

    } catch (e) {

        console.log(e);

    }

}

    
async function generateUserId() {

    const user = getAddUserData();

    if (
        !user.name ||
        !user.facilitator ||
        !user.gender ||
        !user.age ||
        !user.passcode
    ) {

        alert(
            "Please complete all fields."
        );

        return;

    }

    const btn =
        document.getElementById(
            "generateIdBtn"
        );

    btn.disabled = true;

    try {

        showBusy(
            "Checking existing registrations..."
        );

        const dupRes =
            await api(
                "checkDuplicateUser",
                {
                    name: user.name,
                    facilitator:
                        user.facilitator,
                    passcode:
                        user.passcode
                }
            );

        if (
            dupRes.matches &&
            dupRes.matches.length
        ) {

            let msg =
                "Possible existing registrations found:\n\n";

            dupRes.matches.forEach(m => {

                msg +=
                    `${m.name} (${m.id})\n`;

            });

            msg +=
                "\nContinue creating a new registration?";

            hideBusy();

            if (!confirm(msg)) {

                btn.disabled = false;
                return;

            }

        }

        showBusy(
            "Generating User ID..."
        );

        const res =
            await api(
                "generateUserId",
                {
                    name: user.name,
                    facilitator:
                        user.facilitator
                }
            );

        hideBusy();

        btn.disabled = false;

        if (!res.uniqueId) {

            alert(
                res.error ||
                "Unable to generate ID"
            );

            return;

        }

        AppState.suggestedUserId =
            res.uniqueId;

        document.getElementById(
            "generatedId"
        ).innerHTML = `
            <h3>Generated ID</h3>
            <div
            style="
                font-size:24px;
                font-weight:bold;
                color:#0f9d58;
            ">
            ${res.uniqueId}
            </div>
        `;

        const createBtn =
            document.getElementById(
                "createUserBtn"
            );

        createBtn.disabled = false;
        createBtn.style.opacity = "1";

    } catch (err) {

        hideBusy();

        btn.disabled = false;

        alert(
            "Error: " + err
        );

    }

}

async function createUser() {

    const user =
        getAddUserData();

    const age =
        parseInt(
            user.age,
            10
        );

    if (
        isNaN(age) ||
        age <= 5
    ) {

        alert(
            "Users aged 5 years or below need not be registered."
        );

        return;

    }

    const btn =
        document.getElementById(
            "createUserBtn"
        );

    btn.disabled = true;

    try {

        showBusy(
            "Creating User..."
        );

        const res =
            await api(
                "addUser",
                {
                    uniqueId:
                        AppState.suggestedUserId,

                    name:
                        user.name,

                    gender:
                        user.gender,

                    age:
                        user.age,

                    facilitator:
                        user.facilitator,

                    passcode:
                        user.passcode
                }
            );

        hideBusy();

        btn.disabled = false;

        if (
            res.status !==
            "CREATED"
        ) {

            alert(
                res.error ||
                "User creation failed"
            );

            return;

        }

        playCreated();

        await closeAddUserModal();

        showUserCreated(
            res.uniqueId
        );

    } catch (err) {

        hideBusy();

        btn.disabled = false;

        alert(
            "Error: " + err
        );

    }

}
