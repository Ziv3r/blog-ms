const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    console.log("Received Event Comment Created, start to moderate", req.body);

    //moderate the comment ( check orange ... )
    const isCommentModerated = data.content.includes("orange");

    // await new Promise((r) => setTimeout(r, 7000));
    // emit event commentModerated
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        content: data.content,
        postId: data.postId,
        status: isCommentModerated ? "Reject" : "Approved",
      },
    });
  }

  res.status(201).send();
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
