// TODO: anti-pattern, should be using useMutation hook
import { callAPI } from '@core/request'

// Register a user activity to the DB
export class UserActivityService {
  private static instance: UserActivityService

  public static getInstance(): UserActivityService {
    if (!UserActivityService.instance) {
      UserActivityService.instance = new UserActivityService()
    }

    return UserActivityService.instance
  }

  // eslint-disable-next-line class-methods-use-this
  async create(eventType: string) {
    return callAPI<any>({
      variables: { data: { eventType } },
      query: `
        mutation createUserActivity($data: UserActivityCreateInput!) {
          createUserActivity(data: $data) {
            eventType
            createdById
            createdAt
          }
        }
      `,
      operationName: 'createUserActivity',
    })
  }
}
