const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [
  {
    _id: new ObjectID(),
    text: 'first test todo',
    completed: true,
    completedAt: '1'
  },
  {
    _id: new ObjectID(),
    text : 'second test todo'
  }
];

const users = [
  {
    _id: new ObjectID(),
    email: "bobleblob@bob.com",
    password: "bobleblob"
  },
  {
    _id: new ObjectID(),
    email: "bobleblobaussi@bob.com",
    password: "bobleblobaussi"
  }
];

beforeEach((done) => {
  Todo.remove({})
  .then(() => {
    return Todo.insertMany(todos);
  })
  .then(() => User.remove({})
  .then(() => {
    return User.insertMany(users);
  }))
  .then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'test todo text';

    request(app)
    .post('/todos')
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
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    let fakeId = new ObjectID();
    request(app)
    .get(`/todos/${fakeId.toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 in case of invalid id', (done) => {
    request(app)
    .get('todos/123')
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
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

it('should return 404 if todo not found', (done) => {
  let fakeId = new ObjectID();
  request(app)
  .delete(`/todos/${fakeId.toHexString()}`)
  .expect(404)
  .end(done);
});

it('should return 404 if object id is invalid', (done) => {
  request(app)
  .delete('/todos/123')
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
  it('should create a user with provided email and password', (done) => {
    let user_test = {
      email: "encorebob@bob.com",
      password: "encorebob"
    };
    request(app)
    .post('/users')
    .send(user_test)
    .expect(200)
    .expect((res) => {
      expect(res.body.email).toBe(user_test.email);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
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
});

describe('test GET /users/me', () => {
  it('should return 401 if no x-auth header', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .end(done);
  });
});
