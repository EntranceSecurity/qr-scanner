const API_URL = "https://script.google.com/macros/s/AKfycbytSuDftiIWfMNNbhx4TFeS6nYxVJBA_NjOGMs9rghHVHk4FXVYIRwHc95db80ArkA7hg/exec";

async function api(action, params = {}) {

    const qs =
    new URLSearchParams({
        action,
        ...params
    });

    const response =
    await fetch(
        API_URL + "?" + qs
    );

    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}`
        );

    }

    const data =
    await response.json();

    if (
        data &&
        data.status === "ERROR"
    ) {

        throw new Error(
            data.error ||
            data.message ||
            "Unknown server error"
        );

    }

    return data;

}