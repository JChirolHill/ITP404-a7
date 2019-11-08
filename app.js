const express = require('express');
const app = express();

app.use(express.json());

let commentCnt = 1;
const db = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      body: 'something here...',
      comments: []
    },
    {
      id: 2,
      title: 'Post 2',
      body: 'something else here...',
      comments: []
    }
  ]
};

app.get('/api/posts', (request, response) => {
  response.json(db.posts);
});

app.post('/api/posts', (request, response) => {
  const post = request.body;
  post.id = db.posts.length + 1;
  post.comments = [];
  db.posts.push(post);
  response.json(post);
});

// adds new comments to specified post
app.post('/api/comments', (request, response) => {
  const postId = Number(request.body.post);
  const body = request.body.body;

  if(!postId) {
    response.json({
      errors: {
        post: "post is required"
      }
    });
    response.status(400).send();
  }

  // check if valid post id
  const post = db.posts.find((post) => {
    return post.id === postId;
  });

  if(post) {
    post.comments.push({
      id: commentCnt,
      post: post.id,
      body: body
    });
    commentCnt++;
    response.json(post.comments[post.comments.length - 1]);
  }
  else {
    response.status(404).send();
  }
});

app.get('/api/posts/:id/comments', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if(post) {
    response.json(post.comments);
  }
  else {
    response.status(404).send();
  }
});

app.get('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.delete('/api/comments/:id', (request, response) => {
  let deleted = false;
  const id = Number(request.params.id);

  db.posts.forEach((post) => {
    post.comments.forEach((comment) => {
      if(comment.id === id) { // found comment to delete
        post.comments = post.comments.filter((comment) => {
          comment.id !== id;
        });
        deleted = true;
      }
    });
  });

  if(deleted) {
  console.log('returning 204');
    response.status(204).send();
  }
  else {
    console.log('returning 404');
    response.status(404).send();
  }
});

app.delete('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    db.posts = db.posts.filter((post) => {
      return post.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.put('/api/comments/:id', (request, response) => {
  const id = Number(request.params.id);
  let updated = false;

  db.posts.forEach((post) => {
    post.comments.forEach((comment) => {
      if(comment.id === id) {
        Object.assign(comment, request.body);
        console.log(comment);
        console.log(request.body);
        updated = true;
      }
    });
  });

  if(updated) {
    response.status(204).send();
  }
  else {
    response.status(404).send();
  }
});

app.put('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    Object.assign(post, request.body)
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.listen(process.env.PORT || 8000);
