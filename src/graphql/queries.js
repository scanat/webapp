/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncNotifications = /* GraphQL */ `
  query SyncNotifications(
    $filter: ModelNotificationsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncNotifications(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        topic
        description
        status
        subscriberId
        expiry
        image
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getNotifications = /* GraphQL */ `
  query GetNotifications($id: ID!) {
    getNotifications(id: $id) {
      id
      topic
      description
      status
      subscriberId
      expiry
      image
      _version
      _deleted
      _lastChangedAt
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
        expiry
        image
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncUserTables = /* GraphQL */ `
  query SyncUserTables(
    $filter: ModelUserTableFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUserTables(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        saved
        orders
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getUserTable = /* GraphQL */ `
  query GetUserTable($id: ID!) {
    getUserTable(id: $id) {
      id
      saved
      orders
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listUserTables = /* GraphQL */ `
  query ListUserTables(
    $filter: ModelUserTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        saved
        orders
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
