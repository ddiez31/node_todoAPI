const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, users, populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'test todo text';

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err){
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((err) => done(err));
    });
  });

  it('should not create todo with invalid text data', (done) => {
    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send({})
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((err) => done(err));
    });
  });

});

describe('GET /todos', () => {
  it('should fetch all todos', (done) => {
    request(app)
    .get('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should not return todo doc created by another user', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    let fakeId = new ObjectID();
    request(app)
    .get(`/todos/${fakeId.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 in case of invalid id', (done) => {
    request(app)
    .get('todos/123')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      //Query db using findById
      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist();
        done();
      }
    ).catch((e) => done(e))
  });
});

it('should not remove a todo created by another user', (done) => {
  var hexId = todos[1]._id.toHexString();

  request(app)
  .delete(`/todos/${hexId}`)
  .set('x-auth', users[0].tokens[0].token)
  .expect(404)
  .end((err, res) => {
    if(err){
      return done(err);
    }

    //Query db using findById
    Todo.findById(hexId).then((todo) => {
      expect(todo).toExist();
      done();
    }
  ).catch((e) => done(e))
});
});

it('should return 404 if todo not found', (done) => {
  let fakeId = new ObjectID();
  request(app)
  .delete(`/todos/${fakeId.toHexString()}`)
  .set('x-auth', users[0].tokens[0].token)
  .expect(404)
  .end(done);
});

it('should return 404 if object id is invalid', (done) => {
  request(app)
  .delete('/todos/123')
  .set('x-auth', users[0].tokens[0].token)
  .expect(404)
  .end(done);
});
});

describe('PATCH /todos/id', () => {
  it('should update the todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text = 'test';

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      text,
      "completed": true
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completedAt).toBeA('number');
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
      done();
    });
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      "text": "test",
      "completed": false
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.text).toBe("test");
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
      done();
    });
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = "encorebob@bob.com";
    let password = "encorebob";
    let user_test = {
      email,
      password
    };
    request(app)
    .post('/users')
    .send(user_test)
    .expect(200)
    .expect((res) => {
      expect(res.body.email).toBe(user_test.email);
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(user_test.password);
      })
      done();
    });
  });

  it('should return 400 status on invalid email', (done) => {
    let user_test = {
      email: "encorebob.com",
      password: "encorebob"
    };
    request(app)
    .post('/users')
    .send(user_test)
    .expect(400)
    .end(done);
  });

  it('should return 400 status on invalid password', (done) => {
    let user_test = {
      email: "encorebob2@bob.com",
      password: "bob"
    };
    request(app)
    .post('/users')
    .send(user_test)
    .expect(400)
    .end(done);
  });

  it('should not create user if email already in use', (done) => {
    request(app)
    .post('/users')
    .send({
      email: users[0].email,
      password: 'detoutefaconcamarchepas'
    })
    .expect(400)
    .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    }).end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', '')
    .expect(401)
    .expect((res) => {
      expect(res.body).toNotBe();
    }).end(done);
  });

  it('should return 401 if no x-auth header', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toNotBe();
    }).end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
    })
    .end((err, res) => {
      if (err){
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[1]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e))
    });
  });

  it('should reject invalid password', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: 'toto'
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist();
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('should logout user', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err){
        return done(err);
      }

      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });
});
