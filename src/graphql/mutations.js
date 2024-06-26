// mutations.js
window.createComment = `mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    name
    message
    createdAt
    ip
  }
}`;

window.deleteComment = `mutation DeleteComment($input: DeleteCommentInput!) {
  deleteComment(input: $input) {
    id
  }
}`;
