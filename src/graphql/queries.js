/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getNotifications = /* GraphQL */ `
  query GetNotifications($id: ID!) {
    getNotifications(id: $id) {
      id
      topic
      description
      status
      subscriberId
      createdAt
      updatedAt
    }
  }
`;
export const listNotificationss = /* GraphQL */ `
  query ListNotificationss(
    $filter: ModelNotificationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotificationss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        topic
        description
        status
        subscriberId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
