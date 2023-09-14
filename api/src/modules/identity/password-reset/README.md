# Password Reset

A password reset works like so:

- User goes to /forgot-password and enters email
- Front end calls `requestPasswordReset` mutation
- Backend saves a "password_reset" record in DB
- Backend emails user with a link in the form `<base_url>/password-reset?token=<token>`
- User forwarded to /forgot-password-success
- User clicks link in email and goes to `<base_url>/password-reset?token=<token>`
- Fill in password and confirmPassword
- UI calls `resetPassword` mutation
- If successful, shows a message and prompts user to go to login page
