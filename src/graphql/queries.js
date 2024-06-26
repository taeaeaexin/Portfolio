// queries.js
window.listComments = `query ListComments {
  listComments {
    items {
      id
      name
      message
      createdAt
      ip
    }
  }
}`;
