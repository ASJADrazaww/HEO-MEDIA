# Heo Media

## Run locally

```powershell
npm start
```

Open `http://localhost:3000`, then create the first account from the sign-up screen.

## Receive enquiry emails in Gmail

1. Enable two-step verification on the Gmail account that will receive leads.
2. Create a Gmail **App Password** (Google Account → Security → App passwords).
3. Copy `.env.example` to a new file named `.env` and fill in the three values.
4. Restart the server.

Every submitted content request is stored locally and, once Gmail is configured, sent automatically to `INTEREST_EMAIL`. Do not commit `.env`; it contains a secret.
