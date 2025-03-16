const ryos = {

    auth: function(domain, scope, redirect) {
        try {
            if (!Array.isArray(scope)) {
                throw new Error("Scope should be an array of strings.");
            }

            const availableScopes = this.scopes().map(s => s.name);
            const invalidScopes = scope.filter(s => !availableScopes.includes(s));

            if (invalidScopes.length > 0) {
                throw new Error(`Invalid scopes: ${invalidScopes.join(", ")}`);
            }

            if (!redirect || typeof redirect !== "string") {
                throw new Error("Invalid redirect URL.");
            }

            if (!domain || typeof domain !== "string" || !this.isValidDomain(domain)) {
                throw new Error("Invalid domain.");
            }

            const formattedScope = scope.join("_");
            const authUrl = `https://ryos.org?domain=${encodeURIComponent(domain)}&scope=${encodeURIComponent(formattedScope)}&redirect=${encodeURIComponent(redirect)}`;
            window.location.href = authUrl;
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    },

    logout: function() {
        this.deleteCookie("ryos");
        console.log("Logged out, token removed.");
    },

    deleteCookie: function(name) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; SameSite=Strict`;
    },

    check: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = decodeURIComponent(urlParams.get("ryos"));
        if (code) {
            console.log("Found ryos code");
            return code;
        } else {
            console.warn("No ryos param found in the current URL.");
            return null;
        }
    },

    validate: async function(code) {
        try {
            const response = await fetch("https://ryos.org/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) return false;

            const result = await response.json();
            return result.success || false;
        } catch (error) {
            return false;
        }
    },

    scopes: function() {
        return [
            {
                name: "identity",
                description: "Access to the user's identity information, including username, account ID, and account age."
            },
        ];
    },

    isValidDomain: function(domain) {
        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return domainRegex.test(domain);
    }
};

if (typeof window !== "undefined") {
    window.ryos = ryos;
}

export default ryos;
