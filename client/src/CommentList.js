import React from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let newContent = "";
    if (comment.status === "Approved") {
      newContent = comment.content;
    } else if (comment.status === "Pending") {
      newContent = "Proccesing moderation";
    } else {
      newContent = "Reject";
    }

    return <li key={comment.id}>{newContent}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
