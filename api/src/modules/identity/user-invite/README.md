# User Invites

This feature is used to invite internal users into the admin sections of the app. The flow looks like this:

- Existing admin creates a new user invite
- [No email yet] Email goes to email address with link to registration
  - Q: where should it link them? Existing registration screen?
- User goes to `/auth/register?type=reviewer`
- When user registers, we look for an active `user_invite`
- If one exists, we register the user as that user type
