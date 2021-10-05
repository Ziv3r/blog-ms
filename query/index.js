const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, status, postId } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  } else if (type === "CommentUpdated") {
    const { id, content, status, postId } = data;

    const post = posts[postId];
    const newCommentsArray = post.comments.map((comment) => {
      if (comment.id !== id) {
        return comment;
      } else {
        return { ...comment, status: status, content: content };
      }
    });

    posts[postId] = { ...posts[postId], comments: newCommentsArray };
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log("Received Event", req.body.type);
  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");

  const res = await axios.get("http://event-bus-srv:4005/getAllEvents");
  console.log(res.data);

  for (let event of res.data) {
    handleEvent(event.type, event.data);
  }
});
