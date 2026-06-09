function registerServiceWorker(){

    if("serviceWorker" in navigator){

        navigator.serviceWorker
        .register("./sw.js")
        .then(() => console.log("PWA Ready"))
        .catch(console.error);

    }

}

function initApp(){

    registerServiceWorker();

    loadAuthorities();

    loadFacilitators();

    startHeartbeat();

}

document.addEventListener(
    "DOMContentLoaded",
    initApp
);

