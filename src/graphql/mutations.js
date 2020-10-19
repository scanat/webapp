/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSubscriber = /* GraphQL */ `
  mutation CreateSubscriber(
    $input: CreateSubscriberInput!
    $condition: ModelSubscriberConditionInput
  ) {
    createSubscriber(input: $input, condition: $condition) {
      id
      about
      group
      name
      orgName
      phoneNumber
      email
      address1
      address2
      city
      state
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
export const updateSubscriber = /* GraphQL */ `
  mutation UpdateSubscriber(
    $input: UpdateSubscriberInput!
    $condition: ModelSubscriberConditionInput
  ) {
    updateSubscriber(input: $input, condition: $condition) {
      id
      about
      group
      name
      orgName
      phoneNumber
      email
      address1
      address2
      city
      state
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
export const deleteSubscriber = /* GraphQL */ `
  mutation DeleteSubscriber(
    $input: DeleteSubscriberInput!
    $condition: ModelSubscriberConditionInput
  ) {
    deleteSubscriber(input: $input, condition: $condition) {
      id
      about
      group
      name
      orgName
      phoneNumber
      email
      address1
      address2
      city
      state
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
export const createEmployees = /* GraphQL */ `
  mutation CreateEmployees(
    $input: CreateEmployeesInput!
    $condition: ModelEmployeesConditionInput
  ) {
    createEmployees(input: $input, condition: $condition) {
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
export const updateEmployees = /* GraphQL */ `
  mutation UpdateEmployees(
    $input: UpdateEmployeesInput!
    $condition: ModelEmployeesConditionInput
  ) {
    updateEmployees(input: $input, condition: $condition) {
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
export const deleteEmployees = /* GraphQL */ `
  mutation DeleteEmployees(
    $input: DeleteEmployeesInput!
    $condition: ModelEmployeesConditionInput
  ) {
    deleteEmployees(input: $input, condition: $condition) {
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
export const createAccess = /* GraphQL */ `
  mutation CreateAccess(
    $input: CreateAccessInput!
    $condition: ModelAccessConditionInput
  ) {
    createAccess(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const updateAccess = /* GraphQL */ `
  mutation UpdateAccess(
    $input: UpdateAccessInput!
    $condition: ModelAccessConditionInput
  ) {
    updateAccess(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const deleteAccess = /* GraphQL */ `
  mutation DeleteAccess(
    $input: DeleteAccessInput!
    $condition: ModelAccessConditionInput
  ) {
    deleteAccess(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const createSubscriberPage = /* GraphQL */ `
  mutation CreateSubscriberPage(
    $input: CreateSubscriberPageInput!
    $condition: ModelSubscriberPageConditionInput
  ) {
    createSubscriberPage(input: $input, condition: $condition) {
      id
      liveSpace
      createdAt
      updatedAt
    }
  }
`;
export const updateSubscriberPage = /* GraphQL */ `
  mutation UpdateSubscriberPage(
    $input: UpdateSubscriberPageInput!
    $condition: ModelSubscriberPageConditionInput
  ) {
    updateSubscriberPage(input: $input, condition: $condition) {
      id
      liveSpace
      createdAt
      updatedAt
    }
  }
`;
export const deleteSubscriberPage = /* GraphQL */ `
  mutation DeleteSubscriberPage(
    $input: DeleteSubscriberPageInput!
    $condition: ModelSubscriberPageConditionInput
  ) {
    deleteSubscriberPage(input: $input, condition: $condition) {
      id
      liveSpace
      createdAt
      updatedAt
    }
  }
`;
export const createGlobalTable = /* GraphQL */ `
  mutation CreateGlobalTable(
    $input: CreateGlobalTableInput!
    $condition: ModelGlobalTableConditionInput
  ) {
    createGlobalTable(input: $input, condition: $condition) {
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
export const updateGlobalTable = /* GraphQL */ `
  mutation UpdateGlobalTable(
    $input: UpdateGlobalTableInput!
    $condition: ModelGlobalTableConditionInput
  ) {
    updateGlobalTable(input: $input, condition: $condition) {
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
export const deleteGlobalTable = /* GraphQL */ `
  mutation DeleteGlobalTable(
    $input: DeleteGlobalTableInput!
    $condition: ModelGlobalTableConditionInput
  ) {
    deleteGlobalTable(input: $input, condition: $condition) {
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
