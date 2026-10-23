# Setup Guide: Integrate REST API Data into React

Complete these steps before you start the demo "Integrate REST API Data into React" (Activity 3.1: Routing and Server Data). Setup takes about 15 minutes, plus time for your REST Countries account to be approved.

## Step 1: Create a REST Countries API Key

The demo loads country details from REST Countries, which requires a free API key.

1. Go to [restcountries.com](https://restcountries.com) and select **Get an API key** to create a free account.
2. After you sign in, open the **API Keys** page and copy your key.

## Step 2: Install the Mock API Library

The demo uses Mock Service Worker (MSW) to simulate a trips API in the browser. Install version 2, which the demo files are written for:

```bash
npm i -D msw@2
npx msw init public --save
```

## Step 3: Store Your API Key

Create a file named `.env.local` in the project root, next to `package.json`. The name starts with a dot and has no other extension.

Open the file and add this line, replacing the placeholder with your key:

```bash
RESTCOUNTRIES_API_KEY=paste_your_key_here
```

Don't add spaces, quotes, or a `VITE_` prefix. Without the prefix, Vite keeps the key on your computer and never sends it to the browser.

Confirm that Git ignores the file, so your key is never committed:

```bash
git check-ignore .env.local
```

The command should print `.env.local`. If it prints nothing, add `*.local` on a new line in `.gitignore`.
Now you're ready to follow the demo!
