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

        api("ping").catch(()=>{});

    },300000);

}

function printCurrentScreen(){
    window.print();
}