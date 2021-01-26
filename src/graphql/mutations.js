/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSubscriber = /* GraphQL */ `
  mutation CreateSubscriber(
    $input: CreateSubscriberInput!
    $condition: ModelSubscriberConditionInput
  ) {
    createSubscriber(input: $input, condition: $condition) {
      id
      businessHours {
        day1
        day2
        time1
        time2
      }
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
      seqQr
      customQr
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
      latitude
      longitude
      posts
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
      businessHours {
        day1
        day2
        time1
        time2
      }
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
      seqQr
      customQr
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
      latitude
      longitude
      posts
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
      businessHours {
        day1
        day2
        time1
        time2
      }
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
      seqQr
      customQr
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
      latitude
      longitude
      posts
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
        delivery
        desc
      }
      category
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
        delivery
        desc
      }
      category
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
        delivery
        desc
      }
      category
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
        status
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
        status
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
        status
      }
      createdAt
      updatedAt
    }
  }
`;
export const createOrders = /* GraphQL */ `
  mutation CreateOrders(
    $input: CreateOrdersInput!
    $condition: ModelOrdersConditionInput
  ) {
    createOrders(input: $input, condition: $condition) {
      id
      pin
      key
      orgId
      order {
        id
        name
        qty
        price
        rating
        request
        status
      }
      totalItems
      totalPrice
      rating
      status
      createdAt
      updatedAt
    }
  }
`;
export const updateOrders = /* GraphQL */ `
  mutation UpdateOrders(
    $input: UpdateOrdersInput!
    $condition: ModelOrdersConditionInput
  ) {
    updateOrders(input: $input, condition: $condition) {
      id
      pin
      key
      orgId
      order {
        id
        name
        qty
        price
        rating
        request
        status
      }
      totalItems
      totalPrice
      rating
      status
      createdAt
      updatedAt
    }
  }
`;
export const deleteOrders = /* GraphQL */ `
  mutation DeleteOrders(
    $input: DeleteOrdersInput!
    $condition: ModelOrdersConditionInput
  ) {
    deleteOrders(input: $input, condition: $condition) {
      id
      pin
      key
      orgId
      order {
        id
        name
        qty
        price
        rating
        request
        status
      }
      totalItems
      totalPrice
      rating
      status
      createdAt
      updatedAt
    }
  }
`;
export const createUsers = /* GraphQL */ `
  mutation CreateUsers(
    $input: CreateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    createUsers(input: $input, condition: $condition) {
      id
      saved
      orders
      createdAt
      updatedAt
    }
  }
`;
export const updateUsers = /* GraphQL */ `
  mutation UpdateUsers(
    $input: UpdateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    updateUsers(input: $input, condition: $condition) {
      id
      saved
      orders
      createdAt
      updatedAt
    }
  }
`;
export const deleteUsers = /* GraphQL */ `
  mutation DeleteUsers(
    $input: DeleteUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    deleteUsers(input: $input, condition: $condition) {
      id
      saved
      orders
      createdAt
      updatedAt
    }
  }
`;
export const createPosts = /* GraphQL */ `
  mutation CreatePosts(
    $input: CreatePostsInput!
    $condition: ModelPostsConditionInput
  ) {
    createPosts(input: $input, condition: $condition) {
      id
      postedBy
      topic
      desc
      img
      status
      createdAt
      updatedAt
    }
  }
`;
export const updatePosts = /* GraphQL */ `
  mutation UpdatePosts(
    $input: UpdatePostsInput!
    $condition: ModelPostsConditionInput
  ) {
    updatePosts(input: $input, condition: $condition) {
      id
      postedBy
      topic
      desc
      img
      status
      createdAt
      updatedAt
    }
  }
`;
export const deletePosts = /* GraphQL */ `
  mutation DeletePosts(
    $input: DeletePostsInput!
    $condition: ModelPostsConditionInput
  ) {
    deletePosts(input: $input, condition: $condition) {
      id
      postedBy
      topic
      desc
      img
      status
      createdAt
      updatedAt
    }
  }
`;
