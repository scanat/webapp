/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSubscriber = /* GraphQL */ `
  subscription OnCreateSubscriber {
    onCreateSubscriber {
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
export const onUpdateSubscriber = /* GraphQL */ `
  subscription OnUpdateSubscriber {
    onUpdateSubscriber {
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
export const onDeleteSubscriber = /* GraphQL */ `
  subscription OnDeleteSubscriber {
    onDeleteSubscriber {
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
export const onCreateItems = /* GraphQL */ `
  subscription OnCreateItems {
    onCreateItems {
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
export const onUpdateItems = /* GraphQL */ `
  subscription OnUpdateItems {
    onUpdateItems {
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
export const onDeleteItems = /* GraphQL */ `
  subscription OnDeleteItems {
    onDeleteItems {
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
export const onCreateSubscriberPage = /* GraphQL */ `
  subscription OnCreateSubscriberPage {
    onCreateSubscriberPage {
      id
      liveSpace
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSubscriberPage = /* GraphQL */ `
  subscription OnUpdateSubscriberPage {
    onUpdateSubscriberPage {
      id
      liveSpace
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteSubscriberPage = /* GraphQL */ `
  subscription OnDeleteSubscriberPage {
    onDeleteSubscriberPage {
      id
      liveSpace
      createdAt
      updatedAt
    }
  }
`;
export const onCreateGlobalTable = /* GraphQL */ `
  subscription OnCreateGlobalTable {
    onCreateGlobalTable {
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
export const onUpdateGlobalTable = /* GraphQL */ `
  subscription OnUpdateGlobalTable {
    onUpdateGlobalTable {
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
export const onDeleteGlobalTable = /* GraphQL */ `
  subscription OnDeleteGlobalTable {
    onDeleteGlobalTable {
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
