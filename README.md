# BedrockAPI
A simple yet overengineered note app API (with markdown support) made with express and sequelize + postgresql.

Authentication is done with JWT + OTP via google SMTP and passwords are encrypted with argon2.

## How to run
***postgresql must be installed***
- `npm install`
- [Setup Google SMTP](https://dev.to/likhit/i-tried-to-send-emails-using-gmail-smtp-heres-what-actually-worked-2ec1)
- Populate .env using .example.env as a reference
- `npm run dev`, runs with locally defined models
- `npm run start`, uses migrations + executes seeders


## Endpoints
***The API can be easily viewed and used by any tools (insomnia, postman, etc.) but [bruno](https://www.usebruno.com/) is supported by default***

### Root
- Root: /
- Reset: /reset

### Users
- View All: /users/all
- Register: /users/register
- Login: /users/login
- Login OTP: /users/login-otp

### Notes
***Disclaimer: a valid token must be used in the Authorization header***
- View All: /notes/all
- View: /notes/:id
- Create: /notes/create
- Delete: /notes/delete/:id
- Edit: /notes/edit/:id
- Search: /notes/search

- Export PDF: /notes/export-pdf/:id