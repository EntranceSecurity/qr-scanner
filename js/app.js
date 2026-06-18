function registerServiceWorker(){

    if("serviceWorker" in navigator){

        navigator.serviceWorker
        .register("./sw.js")
        .then(() => console.log("PWA Ready"))
        .catch(console.error);

    }

}

const CACHE_STATUS_KEY = "qrScannerCacheStatus";

function saveCacheStatus(status) {
    try {
        localStorage.setItem(CACHE_STATUS_KEY, status);
    } catch (err) {
        // ignore storage issues
    }
}

function restoreCacheIndicator(){
    try {
        const status = localStorage.getItem(CACHE_STATUS_KEY);
        if (status) {
            setCacheIndicator(status);
        }
    } catch (err) {
        setCacheIndicator("pending");
    }
}

async function setCacheIndicator(status) {
    const indicator = document.getElementById("cacheIndicator");
    if (!indicator) return;

    indicator.classList.remove(
        "cache-indicator-pending",
        "cache-indicator-cached",
        "cache-indicator-synced",
        "cache-indicator-offline",
        "cache-indicator-syncing"
    );

    const label = indicator.querySelector(".cache-label");

    if (status === "synced") {
        indicator.classList.add("cache-indicator-synced");
        label.innerText = "Data synced";
    } else if (status === "cached") {
        indicator.classList.add("cache-indicator-cached");
        label.innerText = "Using cached data";
    } else if (status === "offline") {
        indicator.classList.add("cache-indicator-offline");
        label.innerText = "Offline — using cached data";
    } else if (status === "syncing") {
        indicator.classList.add("cache-indicator-syncing");
        label.innerText = "Syncing data...";
    } else {
        indicator.classList.add("cache-indicator-pending");
        label.innerText = "Waiting for data";
    }

    saveCacheStatus(status);
}

async function loadStartupData(){
    try {
        const data = await api("init", {}, {
            cache: true,
            onCacheStatus: status => {
                setCacheIndicator(status);
            }
        });

        if (data) {
            loadAuthoritiesFromData(data.authorities || []);
            loadFacilitatorsFromData(data.facilitators || []);
        }
    } catch (err) {
        console.warn("Startup data load failed", err);
        setCacheIndicator("offline");
        loadAuthorities();
        loadFacilitators();
    }
}

function initApp(){

    restoreCacheIndicator();

    registerServiceWorker();

    if (!navigator.onLine) {
        setCacheIndicator("offline");
    }

    window.addEventListener("online", () => setCacheIndicator("syncing"));
    window.addEventListener("offline", () => setCacheIndicator("offline"));

    loadStartupData();

    startHeartbeat();

}

document.addEventListener(
    "DOMContentLoaded",
    initApp
);

