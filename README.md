# BedrockApi
A simple yet overengineered note app API (with markdown support) made with express and sequelize + postgresql.

Authentication is done with JWT and passwords are encrypted with bcrypt.

## How to run
- `npm install`
- [Setup Google SMTP](https://dev.to/likhit/i-tried-to-send-emails-using-gmail-smtp-heres-what-actually-worked-2ec1)
- `npm run dev`, runs with locally defined models
- `npm run start`, uses migrations


## Endpoints
*The API can be easily viewed and used by any tools (insomnia, postman, etc.) but [bruno](https://www.usebruno.com/) is supported by default*

### Users
- Register: /users/register
- Login: /users/login

### Notes
*Disclaimer: a valid token must be used in the Authorization header*
- View: /notes/:id
- Create: /notes/create
- Delete: /notes/delete/:id
- Edit: /notes/edit/:id