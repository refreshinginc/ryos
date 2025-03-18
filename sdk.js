const ryos = {

  // Initiate authentication
  auth: function (domain, scope, redirect) {
    try {
      if (!Array.isArray(scope)) {
        throw new Error("Scope should be an array of strings.");
      }

      const availableScopes = this.scopes().map((s) => s.name);
      const invalidScopes = scope.filter((s) => !availableScopes.includes(s));
      const isValidDomain = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(domain);

      if (invalidScopes.length > 0) {
        throw new Error(`Invalid scopes: ${invalidScopes.join(", ")}`);
      }

      if (!redirect || typeof redirect !== "string") {
        throw new Error("Invalid redirect URL.");
      }

      if (!domain || typeof domain !== "string" || !isValidDomain) {
        throw new Error("Invalid domain.");
      }

      const formattedScope = scope.join("_");
      const authUrl = `https://ryos.org?domain=${encodeURIComponent(domain)}&scope=${encodeURIComponent(
        formattedScope
      )}&redirect=${encodeURIComponent(redirect)}`;

      if (typeof window !== "undefined") {
        window.location.href = authUrl;
      } else {
        return authUrl;
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  },

  // Method to handle user logout
  logout: function (name = "ryos_session") {
    if (typeof window !== "undefined") {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; SameSite=Strict`;
      console.log("Logged out, token removed.");
    } else {
      throw new Error("ryos.logout() is only supported in a browser environment.");
    }
  },

  // Check for one-time code in the URL
  check: function () {
    if (typeof window !== "undefined") {

      const urlParams = new URLSearchParams(window.location.search);
      const code = decodeURIComponent(urlParams.get("ryos"));

      if (code !== null && code !== "null" && code !== "") {
        console.log("Found ryos code");
        return code;
      } else {
        console.warn("No valid ryos code found in the current URL.");
        return null;
      }
    } else {
      throw new Error("ryos.check() is only supported in a browser environment.");
    }
  },

  // Validate one-time code
  validate: async function (code) {
    try {
      const response = await fetch("https://ryos.org/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) return false;

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error("Error validating code:", error);
      return false;
    }
  },

  // Available scopes
  scopes: function () {
    return [
      {
        name: "identity",
        description: "Access to the user's identity information, including username, account ID, and account age.",
      },
    ];
  },
};

// Export for environments
if (typeof window !== "undefined") {
  window.ryos = ryos;
}

export default ryos;
