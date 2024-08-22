import app from '../task.js';
import { use, expect } from 'chai';
import chaiHttp from 'chai-http';

const chai = use(chaiHttp);
const request = chai.request.execute;
chai.should();

describe('Task APIs', () => {
    describe('Test GET route /api/tasks', () => {
        it('It should return all tasks', done => {
          request(app)
            .get('/api/tasks')
            .end((err,response)=>{
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body.length.should.not.be.eq(0);
                done();
            });  
        });

        it('It should NOT return all the tasks', done => {
            request(app)
                .get("/api/task")
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                });
        });
        
    });

    describe("GET /api/tasks/:id", () => {
        it("It should GET a task by ID", done => {
            const taskId = 1;
            request(app)
                .get("/api/tasks/" + taskId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    response.body.should.have.property('name');
                    response.body.should.have.property('completed');
                    response.body.should.have.property('id').eq(1);
                done(); 
                });
        });
    });

    describe('POST /api/tasks', () => {
        it("It should POST a task", done => {
            const task = {
                name: 'Task 4',
                completed: false
            }
            request(app)
                .post("/api/tasks")
                .send(task)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('name').eq('Task 4');
                    response.body.should.have.property('completed').eq(false);
                    response.body.should.have.property('id').eq(4);
                    done();
                });
        });
        it('It shoud not POST a new task without the name property', done => {
            const task = {
                completed: false
            }
            request(app)
                .post('/api/tasks')
                .send(task)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("The name should be at least 3 chars long!");
                done();
                });
        });
    });

    describe('PUT /api/task/:id', () => {
        it("It should PUT an existing task", (done) => {
            const taskId = 1;
            const task = {
                name: "Task 1 changed",
                completed: true
            };
            request(app)                
                .put("/api/tasks/" + taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id').eq(1);
                    response.body.should.have.property('name').eq("Task 1 changed");
                    response.body.should.have.property('completed').eq(true);
                done();
                });
        });
        it("It should NOT PUT an existing task with a name less than 3 characters", (done) => {
            const taskId = 1;
            const task = {
                name: "Ta",
                completed: true
            };
            request(app)                
                .put("/api/tasks/" + taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("The name should be at least 3 chars long!");
                done();
                });
        });
    });

    describe('PATCH /api/task/:id', () => {
        it("It should PATCH an existing task", (done) => {
            const taskId = 1;
            const task = {
                name: "Task 1 Patch",
            };
            request(app)                
                .patch("/api/tasks/" + taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id').eq(1);
                    response.body.should.have.property('name').eq("Task 1 Patch");
                    response.body.should.have.property('completed').eq(true);
                done();
                });
        });
        it("It should NOT PATCH an existing task with a name less than 3 characters", (done) => {
            const taskId = 1;
            const task = {
                name: "Ta",
            };
            request(app)                
                .patch("/api/tasks/" + taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("The name should be at least 3 chars long!");
                done();
                });
        });
    });

    describe('DELETE, /api/tasks/:id', () => {
        it('It should DELETE an existing task', done => {
            const taskId = 1;
            request(app)
                .delete('/api/tasks/' + taskId)
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                });
        });
        it('It should NOT DELETE a task that is not in the DB', done => {
            const taskId = 300;
            request(app)
                .delete('/api/tasks/' + taskId)
                .end((err, response) => {
                    response.should.have.status(404)
                    response.text.should.be.eq('The task with the provided ID does not exist.');
                done();
                })
        });
    });

});