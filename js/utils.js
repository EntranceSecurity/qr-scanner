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

function printQrLabel(uniqueId, title) {
    const printContainer = document.getElementById("printContainer");
    if (!printContainer) {
        window.print();
        return;
    }

    printContainer.innerHTML = `
        <div class="print-label">
            <div class="print-heading">${title || "QR Code"}</div>
            <div class="print-id">${uniqueId}</div>
            <img
                class="print-qr"
                src="https://quickchart.io/qr?text=${encodeURIComponent(uniqueId)}&size=600"
                alt="QR Code">
            <div class="print-note">Scan this code to verify the user.</div>
        </div>
    `;

    const cleanup = () => {
        printContainer.innerHTML = "";
        window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);
    window.print();
}

function printCurrentScreen(){
    window.print();
}