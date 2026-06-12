# BedrockApp
A simple yet overengineered note app API (with markdown support) made with express and sequelize + postgresql.

Authentication is done with JWT and passwords are encrypted with bcrypt.

## Endpoints

### Users
- Register: /users/register
- Login: /users/login

### Notes
*Disclaimer: a valid token must be used in the Authorization header*
- View: /notes/:id
- Create: /notes/create
- Delete: /notes/delete/:id
- Edit: /notes/edit/:id