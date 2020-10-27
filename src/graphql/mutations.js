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
      banner
      twitter
      facebook
      pinterest
      instagram
      ambience {
        name
      }
      employees {
        id
        name
        access {
          id
          name
        }
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
      banner
      twitter
      facebook
      pinterest
      instagram
      ambience {
        name
      }
      employees {
        id
        name
        access {
          id
          name
        }
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
      banner
      twitter
      facebook
      pinterest
      instagram
      ambience {
        name
      }
      employees {
        id
        name
        access {
          id
          name
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const createItems = /* GraphQL */ `
  mutation CreateItems(
    $input: CreateItemsInput!
    $condition: ModelItemsConditionInput
  ) {
    createItems(input: $input, condition: $condition) {
      id
      itemList {
        id
        category
        itemName
        itemPrice
        image
        status
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateItems = /* GraphQL */ `
  mutation UpdateItems(
    $input: UpdateItemsInput!
    $condition: ModelItemsConditionInput
  ) {
    updateItems(input: $input, condition: $condition) {
      id
      itemList {
        id
        category
        itemName
        itemPrice
        image
        status
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteItems = /* GraphQL */ `
  mutation DeleteItems(
    $input: DeleteItemsInput!
    $condition: ModelItemsConditionInput
  ) {
    deleteItems(input: $input, condition: $condition) {
      id
      itemList {
        id
        category
        itemName
        itemPrice
        image
        status
      }
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
