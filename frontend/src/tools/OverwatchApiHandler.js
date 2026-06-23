/**
 * @readonly
 * @enum {string}
 */
export const ENDPOINTS = Object.freeze({
    SEARCH: "search",
    SUMMARY: "summary",
    STATS_SUMMARY: "stats/summary",
});

export default class OverwatchApiHandler {
    /**
     * @private
     */
    static _url = Object.freeze(new URL("/api/players/",window.location.origin));

    static get url() {
        return this._url.href;
    }

    /**
     * GET Method
     * @param {string} endpoint - Siehe ENDPOINTS
     * @param {string|null} [path] - z.B. '4'
     * @returns {Promise<Response>}
     */
    static GET(endpoint, path = null) {
        const url = new URL(
            `${endpoint}${path !== null ? "/" + path : ""}`,
            this._url
        );

        return fetch(url, {
            headers: {
                "Accept": "application/json"
            },
            redirect: "error",
            method: "GET"
        });
    }

    /**
     * POST Method
     * @param {string} endpoint
     * @param {string|null} [path]
     * @param {object} [data]
     * @returns {Promise<Response>}
     */
    static POST(endpoint, path = null, data = null) {
        return fetch(`${this.url}${endpoint}${path ? "/" + path : ""}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data ?? {}),
            redirect: "error",
            method: "POST"
        });
    }

    /**
     * PUT Method
     * @param {string} endpoint
     * @param {string|null} [path]
     * @param {object} [data]
     * @returns {Promise<Response>}
     */
    static PUT(endpoint, path = null, data = null) {
        return fetch(`${this.url}${endpoint}${path ? "/" + path : ""}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data ?? {}),
            redirect: "error",
            method: "PUT"
        });
    }

    /**
     * Alias für PUT
     * @param {string} endpoint
     * @param {string|null} [path]
     * @param {object} [data]
     * @returns {Promise<Response>}
     */
    static UPDATE(endpoint, path = null, data = null) {
        return this.PUT(endpoint, path, data);
    }

    /**
     * DELETE Method
     * @param {string} endpoint
     * @param {string|null} [path]
     * @returns {Promise<Response>}
     */
    static DELETE(endpoint, path = null) {
        return fetch(`${this.url}${endpoint}${path ? "/" + path : ""}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            redirect: "error",
            method: "DELETE"
        });
    }
}