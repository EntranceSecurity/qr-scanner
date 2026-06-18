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

function getCacheStatusMessage(status) {
    switch (status) {
        case "synced":
            return "Data synced";
        case "cached":
            return "Using cached data";
        case "offline":
            return "Offline — using cached data";
        case "syncing":
            return "Syncing data...";
        case "error":
            return "Connection error";
        default:
            return "Waiting for data";
    }
}

function toggleCacheIndicatorInfo() {
    const messageBox = document.getElementById("cacheIndicatorMessage");
    if (!messageBox) return;
    messageBox.classList.toggle("visible");
}

window.addEventListener("click", (event) => {
    const messageBox = document.getElementById("cacheIndicatorMessage");
    const indicator = document.getElementById("cacheIndicator");
    if (!messageBox || !indicator) return;
    if (
        !event.target.closest("#cacheIndicator") &&
        !event.target.closest("#cacheIndicatorMessage")
    ) {
        messageBox.classList.remove("visible");
    }
});

async function setCacheIndicator(status, message) {
    const indicator = document.getElementById("cacheIndicator");
    const messageBox = document.getElementById("cacheIndicatorMessage");
    if (!indicator) return;

    indicator.classList.remove(
        "cache-indicator-pending",
        "cache-indicator-cached",
        "cache-indicator-synced",
        "cache-indicator-offline",
        "cache-indicator-syncing",
        "cache-indicator-error"
    );

    const label = indicator.querySelector(".cache-label");
    const statusMessage = message || getCacheStatusMessage(status);

    if (status === "synced") {
        indicator.classList.add("cache-indicator-synced");
    } else if (status === "cached") {
        indicator.classList.add("cache-indicator-cached");
    } else if (status === "offline") {
        indicator.classList.add("cache-indicator-offline");
    } else if (status === "syncing") {
        indicator.classList.add("cache-indicator-syncing");
    } else if (status === "error") {
        indicator.classList.add("cache-indicator-offline");
    } else {
        indicator.classList.add("cache-indicator-pending");
    }

    if (label) {
        label.innerText = statusMessage;
    }
    indicator.dataset.statusMessage = statusMessage;
    if (messageBox) {
        messageBox.innerText = statusMessage;
        messageBox.classList.remove("visible");
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
            if (data.userIndex) {
                saveUserIndex(data.userIndex);
            }
        }
    } catch (err) {
        console.warn("Startup data load failed", err);
        const offlineMessage = navigator.onLine ? (err.message || "Failed to refresh data") : "Offline and no cached data available";
        setCacheIndicator("error", offlineMessage);
        loadAuthorities();
        loadFacilitators();
    }
}

function saveUserIndex(userIndex) {
    try {
        localStorage.setItem("userIndex", JSON.stringify(userIndex));
        try { AppState.userIndex = userIndex; } catch (e) {}
    } catch (err) {
        console.warn("Failed to cache user index", err);
    }
}

function getUserIndex() {
    try {
        if (AppState.userIndex) return AppState.userIndex;
        const stored = localStorage.getItem("userIndex");
        const parsed = stored ? JSON.parse(stored) : null;
        if (parsed) {
            try { AppState.userIndex = parsed; } catch (e) {}
        }
        return parsed;
    } catch (err) {
        return null;
    }
}

// If the explicit `userIndex` key isn't available, try the cached `init` API payload
function ensureUserIndexFromApiCache() {
    try {
        const existing = getUserIndex();
        if (existing) return existing;
        if (typeof getCachedApi === 'function') {
            const initPayload = getCachedApi('init', {});
            if (initPayload && initPayload.userIndex) {
                try { saveUserIndex(initPayload.userIndex); } catch (e) {}
                AppState.userIndex = initPayload.userIndex;
                return initPayload.userIndex;
            }
        }
    } catch (e) {}
    return null;
}

function verifyUserOffline(userId) {
    const userIndex = getUserIndex();
    if (!userIndex || !userIndex.byId) return null;

    const user = userIndex.byId[userId];
    if (user) {
        return {
            status: "APPROVED",
            id: userId,
            name: user.name,
            gender: user.gender,
            age: user.age,
            facilitator: user.facilitator,
            passcode: user.passcode
        };
    }

    return {
        status: "DENIED",
        id: userId
    };
}

function verifyManualOffline(uniqueId, name, facilitator, passcode, authority) {
    const userIndex = getUserIndex();
    if (!userIndex) return null;

    if (uniqueId && uniqueId.trim()) {
        const user = userIndex.byId[uniqueId];
        if (user) {
            return {
                status: "APPROVED",
                id: uniqueId,
                name: user.name,
                gender: user.gender,
                age: user.age,
                facilitator: user.facilitator,
                passcode: user.passcode
            };
        }
        return {
            status: "DENIED",
            id: uniqueId
        };
    }

    if (name && facilitator && passcode) {
        const facilitatorKey = facilitator.toLowerCase() + "|" + passcode.toLowerCase();
        const candidates = userIndex.byFacilitatorPasscode[facilitatorKey] || [];

        const nameLower = name.toLowerCase();
        const matches = candidates.filter(u => u.nameLower === nameLower);

        if (matches.length === 1) {
            const user = matches[0];
            return {
                status: "APPROVED",
                id: user.id,
                name: user.name,
                gender: user.gender,
                age: user.age,
                facilitator: user.facilitator,
                passcode: user.passcode
            };
        } else if (matches.length > 1) {
            return {
                status: "MULTIPLE_MATCHES",
                matches: matches
            };
        }
    }

    return null;
}

function initApp(){

    restoreCacheIndicator();

    // Restore cached user index into memory for instant lookups
    try {
        const existing = getUserIndex();
        if (existing) {
            AppState.userIndex = existing;
        }
    } catch (e) {}

    registerServiceWorker();

    if (!navigator.onLine) {
        setCacheIndicator("offline", "Offline — using cached data if available");
    }

    window.addEventListener("online", async () => {
        setCacheIndicator("syncing", "Reconnecting and refreshing data...");
        try {
            await loadStartupData();
            if (AppState.html5QrCode) {
                await restartScanner();
            }
        } catch (err) {
            console.warn("Reconnect refresh failed", err);
        }
    });

    window.addEventListener("offline", () => setCacheIndicator("offline", "Offline — using cached data if available"));

    loadStartupData();

    startHeartbeat();

}

document.addEventListener(
    "DOMContentLoaded",
    initApp
);

