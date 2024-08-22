import express from 'express';
import validateTask from './utils/task-schema.js';

const app = express();

app.use(express.json());

const tasks = [
    {
        id: 1,
        name: "Task 1",
        completed: false
    },
    {
        id: 2,
        name: "Task 2",
        completed: false
    },
    {
        id: 3,
        name: "Task 3",
        completed: false
    }
];

app.get('/api/tasks', (req,res) => res.send(tasks));

app.get('/api/tasks/:id', (req,res) => {
    const taskId = req.params.id;
    const task = tasks.find(task => task.id === parseInt(taskId));
    if(!task) return res.status(404).send("Task doesn't exist");
    res.send(task);
});

app.post('/api/tasks', (req,res) => {

    const { error } = validateTask(req.body);

    if(error) return res.status(400).send("The name should be at least 3 chars long!")

    const task = {
        id: tasks.length + 1,
        name: req.body.name,
        completed: req.body.completed
    };

    tasks.push(task);
    res.status(201).send(task);

});

app.put("/api/tasks/:id", (req, res) => {

    const taskId = req.params.id;
    const task = tasks.find(task => task.id === parseInt(taskId));
    if(!task) return res.status(404).send("The task with the provided ID does not exist.");

    const { error } = validateTask(req.body);

    if(error) return res.status(400).send("The name should be at least 3 chars long!")

    task.name = req.body.name;
    task.completed = req.body.completed;

    res.send(task);

});

app.patch("/api/tasks/:id", (req, res) => {

    const taskId = req.params.id;
    const task = tasks.find(task => task.id === parseInt(taskId));
    if(!task) return res.status(404).send("The task with the provided ID does not exist.");

    const { error } = validateTask(req.body);

    if(error) return res.status(400).send("The name should be at least 3 chars long!")

    task.name = req.body.name;

    if(req.body.completed){
       task.completed = req.body.completed; 
    }

    res.send(task);

});

app.delete("/api/tasks/:id", (req,res) => {

    const taskId = req.params.id;
    const task = tasks.find(task => task.id === parseInt(taskId));
    if(!task) return res.status(404).send('The task with the provided ID does not exist.');

    const index = tasks.indexOf(task);
    tasks.splice(index, 1)
    res.send(task);
    
});


app.listen(3000, (req,res)=>{
    console.log('Server started on port 3000');
});

export default app;