const API_URL = "https://proxy.adminsecurity108.workers.dev/";

function getApiCacheKey(action, params) {
    return `api_cache_${action}_${JSON.stringify(params || {})}`;
}

function getCachedApi(action, params) {
    try {
        const key = getApiCacheKey(action, params);
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        const payload = JSON.parse(raw);
        if (!payload) {
            localStorage.removeItem(key);
            return null;
        }

        return payload.data;
    } catch (err) {
        return null;
    }
}

function setCachedApi(action, params, data) {
    try {
        const key = getApiCacheKey(action, params);
        localStorage.setItem(
            key,
            JSON.stringify({
                data: data
            })
        );
    } catch (err) {
        // ignore storage issues
    }
}

async function api(action, params = {}, options = {}) {
    const useCache = options.cache === true;
    const notify = typeof options.onCacheStatus === "function";
    const cachedData = useCache ? getCachedApi(action, params) : null;

    if (navigator.onLine) {
        if (notify) {
            options.onCacheStatus("syncing");
        }

        const qs = new URLSearchParams({
            action,
            ...params
        });

        try {
            const response = await fetch(API_URL + "?" + qs);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data && data.status === "ERROR") {
                throw new Error(data.error || data.message || "Unknown server error");
            }

            if (useCache) {
                setCachedApi(action, params, data);
                // If init payload contains userIndex, persist it separately for immediate offline lookup
                try {
                    if (action === 'init' && data && data.userIndex) {
                        localStorage.setItem('userIndex', JSON.stringify(data.userIndex));
                        if (typeof AppState !== 'undefined') {
                            try { AppState.userIndex = data.userIndex; } catch (e) {}
                        }
                        if (typeof window !== 'undefined' && typeof window.setCacheIndicator === 'function') {
                            try { window.setCacheIndicator('cached'); } catch (e) {}
                        }
                    }
                } catch (e) {}
            }

            // Inform caller and global indicator of successful sync
            if (notify) {
                options.onCacheStatus("synced");
            }
            if (typeof window !== 'undefined' && typeof window.setCacheIndicator === 'function') {
                try { window.setCacheIndicator('synced'); } catch (e) {}
            }

            return data;
        } catch (err) {
            if (cachedData) {
                if (notify) {
                    options.onCacheStatus("offline");
                }
                if (typeof window !== 'undefined' && typeof window.setCacheIndicator === 'function') {
                    try { window.setCacheIndicator('offline'); } catch (e) {}
                }
                    // If returning cached init payload, ensure userIndex is available separately
                    try {
                        if (action === 'init' && cachedData && cachedData.userIndex) {
                            localStorage.setItem('userIndex', JSON.stringify(cachedData.userIndex));
                            if (typeof AppState !== 'undefined') {
                                try { AppState.userIndex = cachedData.userIndex; } catch (e) {}
                            }
                        }
                    } catch (e) {}
                return cachedData;
            }
            if (notify) {
                options.onCacheStatus("error");
            }
            throw err;
        }
    }

    if (cachedData) {
        if (notify) {
            options.onCacheStatus("offline");
        }
        if (typeof window !== 'undefined' && typeof window.setCacheIndicator === 'function') {
            try { window.setCacheIndicator('offline'); } catch (e) {}
        }
            // Ensure userIndex persisted when returning cached init payload from offline branch
            try {
                if (action === 'init' && cachedData && cachedData.userIndex) {
                    localStorage.setItem('userIndex', JSON.stringify(cachedData.userIndex));
                    if (typeof AppState !== 'undefined') {
                        try { AppState.userIndex = cachedData.userIndex; } catch (e) {}
                    }
                }
            } catch (e) {}
        return cachedData;
    }

    if (notify) {
        options.onCacheStatus("error");
    }
    throw new Error("Offline and no cached data available");
}
