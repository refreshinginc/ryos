# RYOS Official SDK ✨

The Official RYOS Authentication SDK.

## 🟥 Installation 

```
npm install --save ryos
```

## 🟧 API

```js
const ryos = require("ryos")
```

### Auth

`ryos.auth(domain, scopes, redirect)` [Usage](#authenticating-a-user) | [Scopes](#-available-scopes)

Initiates the authentication process and redirects the user to the official RYOS authentication domain (`ryos.org`).

- `domain` (String) [Required]: The base domain requesting authorization.
- `scopes` (Array) [Required]: An array of strings representing the requested scopes (e.g., `["profile", "email"]`).
- `redirect` (String) [Required]: The URL to redirect back to after successful authentication.

- Returns (void): This method initiates the authentication process and redirects the user to the RYOS authentication domain. No value is returned as the process is handled via the redirect.

### Validate

`ryos.validate()` [Usage](#validating-codes)

Checks if the current URL contains the `ryos` query, grabs the auth code, validates code, resolves code to a session token and stores to a secure cookie.

- Returns (Boolean): `true` if the code was found, validated, resolved to session token and stored to secure cookie, `false` otherwise.

### Logout

`ryos.logout()` [Usage](#logging-out)

Logs the user out by removing the authentication token stored in the cookie.

- Returns (Boolean): `true` if logout was successful, `false` if logout failed.

## 🟨 Usage

### Authenticating A User
To start the authentication process and redirect the user to Ryos' login page with the specified URL and scope:
```js
// Import the RYOS SDK
const ryos = require("ryos");

// Redirects the user and requests example.com get access to the users identity before redirecting to https://example.com/authorized
ryos.auth("example.com", ["identity"], "https://example.com/authorized");
```

### Validating Codes
After a user logs in and has been redirected back to your specified redirect url, you can call ryos.validate() to check for a ryos code in the url query, and validate it:
```js
// Import the RYOS SDK
const ryos = require("ryos");

// Check the current URL for a RYOS auth code, validate it, and have it resolve with a session token to a secure cookie
ryos.validate(foundCode).then(isValidated => {
    // Check if auth code was found, validated and resolved to a session token stored in secure cookie
    if (isValidated) {
        console.log("Session token saved to cookie.");
    } else {
        console.log("Auth code not found, is invalid or expired.");
    }
});
```

### Logging Out
To log out the user and remove the stored token:
```js
// Import the RYOS SDK
const ryos = require("ryos");

// Log the user out by removing the authentication token from the cookie
ryos.logout();

// Confirm that the user has logged out
console.log("You have logged out.");
```

## 🟩 Available Scopes

The scope parameter in the `ryos.auth(domain, scopes, redirect)` method allows you to specify what kind of access you’re requesting from the authenticated user. Below are the common scopes you can request:

- `identity`: Access to the user's username.
