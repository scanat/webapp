/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSubscriber = /* GraphQL */ `
  query GetSubscriber($id: ID!) {
    getSubscriber(id: $id) {
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
export const listSubscribers = /* GraphQL */ `
  query ListSubscribers(
    $filter: ModelSubscriberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubscribers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
        latitude
        longitude
        posts
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getItems = /* GraphQL */ `
  query GetItems($id: ID!) {
    getItems(id: $id) {
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
export const listItemss = /* GraphQL */ `
  query ListItemss(
    $filter: ModelItemsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listItemss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        status
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
          status
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOrders = /* GraphQL */ `
  query GetOrders($id: ID!) {
    getOrders(id: $id) {
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
export const listOrderss = /* GraphQL */ `
  query ListOrderss(
    $filter: ModelOrdersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrderss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getUsers = /* GraphQL */ `
  query GetUsers($id: ID!) {
    getUsers(id: $id) {
      id
      saved
      orders
      createdAt
      updatedAt
    }
  }
`;
export const listUserss = /* GraphQL */ `
  query ListUserss(
    $filter: ModelUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        saved
        orders
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPosts = /* GraphQL */ `
  query GetPosts($id: ID!) {
    getPosts(id: $id) {
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
export const listPostss = /* GraphQL */ `
  query ListPostss(
    $filter: ModelPostsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPostss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        postedBy
        topic
        desc
        img
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
