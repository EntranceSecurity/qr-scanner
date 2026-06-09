function toggleClearButton(fieldId){

    const field =
    document.getElementById(fieldId);

    const btn =
    document.getElementById(fieldId + "Clear");

    btn.style.display =
        field.value.trim() ? "block" : "none";

}

function clearField(fieldId){

    const field =
    document.getElementById(fieldId);

    field.value = "";

    toggleClearButton(fieldId);

    field.focus();

}

function startHeartbeat(){

    setInterval(() => {

        fetch(
            API_URL +
            "?action=ping"
        ).catch(()=>{});

    },300000);

}