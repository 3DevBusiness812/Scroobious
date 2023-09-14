# Subscriptions

Subscriptions are a way to perform side effects after an action has happened in the API.

## How do subscriptions work?

In order to enable a subscription, the following must all be true:

1. Service needs to extend the BaseModel defined in the `core` folder
2. You need to register the `event_type` for the event you want to hook into. The format is `<resource>.<action>` i.e. `conversation_message.create`. Do this by running the `createEventType` mutation
3. This `event_type` must have `allowSubscription` = `true`
4. You need to create a subscription that listens to one of these event types
