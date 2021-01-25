/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createNotifications = /* GraphQL */ `
  mutation CreateNotifications(
    $input: CreateNotificationsInput!
    $condition: ModelNotificationsConditionInput
  ) {
    createNotifications(input: $input, condition: $condition) {
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
export const updateNotifications = /* GraphQL */ `
  mutation UpdateNotifications(
    $input: UpdateNotificationsInput!
    $condition: ModelNotificationsConditionInput
  ) {
    updateNotifications(input: $input, condition: $condition) {
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
export const deleteNotifications = /* GraphQL */ `
  mutation DeleteNotifications(
    $input: DeleteNotificationsInput!
    $condition: ModelNotificationsConditionInput
  ) {
    deleteNotifications(input: $input, condition: $condition) {
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
export const createUserTable = /* GraphQL */ `
  mutation CreateUserTable(
    $input: CreateUserTableInput!
    $condition: ModelUserTableConditionInput
  ) {
    createUserTable(input: $input, condition: $condition) {
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
export const updateUserTable = /* GraphQL */ `
  mutation UpdateUserTable(
    $input: UpdateUserTableInput!
    $condition: ModelUserTableConditionInput
  ) {
    updateUserTable(input: $input, condition: $condition) {
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
export const deleteUserTable = /* GraphQL */ `
  mutation DeleteUserTable(
    $input: DeleteUserTableInput!
    $condition: ModelUserTableConditionInput
  ) {
    deleteUserTable(input: $input, condition: $condition) {
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
