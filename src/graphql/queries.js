/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSubscriber = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
      id
      group
      name
      orgName
      phoneNumber
      email
      address1
      address2
      postalCode
      category
      logo
      twitter
      facebook
      pinterest
      instagram
      employees {
        id
        name
        access {
          id
          name
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listSubscribers = /* GraphQL */ `
  query ListSubscribers(
    $filter: ModelSubscriberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubscribers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        group
        name
        orgName
        phoneNumber
        email
        address1
        address2
        postalCode
        category
        logo
        twitter
        facebook
        pinterest
        instagram
        employees {
          id
          name
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getEmployees = /* GraphQL */ `
  query GetEmployees($id: ID!) {
    getEmployees(id: $id) {
      id
      name
      access {
        id
        name
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listEmployeess = /* GraphQL */ `
  query ListEmployeess(
    $filter: ModelEmployeesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEmployeess(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        access {
          id
          name
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAccess = /* GraphQL */ `
  query GetAccess($id: ID!) {
    getAccess(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listAccesss = /* GraphQL */ `
  query ListAccesss(
    $filter: ModelAccessFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccesss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSubscriberPage = /* GraphQL */ `
  query GetSubscriberPage($id: ID!) {
    getSubscriberPage(id: $id) {
      id
      liveSpace
      createdAt
      updatedAt
    }
  }
`;
export const listSubscriberPages = /* GraphQL */ `
  query ListSubscriberPages(
    $filter: ModelSubscriberPageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubscriberPages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        liveSpace
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGlobalTable = /* GraphQL */ `
  query GetGlobalTable($id: ID!) {
    getGlobalTable(id: $id) {
      id
      categories {
        name
        price
      }
      modules {
        name
        description
        default
        price
      }
      createdAt
      updatedAt
    }
  }
`;
export const listGlobalTables = /* GraphQL */ `
  query ListGlobalTables(
    $filter: ModelGlobalTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGlobalTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        categories {
          name
          price
        }
        modules {
          name
          description
          default
          price
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;