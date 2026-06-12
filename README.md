# BedrockApp
A simple yet overengineered note app API (with markdown support) made with express and sequelize + postgresql.

Authentication is done with JWT and passwords are encrypted with bcrypt.

## Endpoints
*The API can be easily viewed and used ny any tool (insomnia, postman, etc.) but [bruno](https://www.usebruno.com/) is integrated*

### Users
- Register: /users/register
- Login: /users/login

### Notes
*Disclaimer: a valid token must be used in the Authorization header*
- View: /notes/:id
- Create: /notes/create
- Delete: /notes/delete/:id
- Edit: /notes/edit/:id