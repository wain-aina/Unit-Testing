import joi from 'joi';

const schema = joi.object({
    name: joi.string().min(3).required(),
    completed: joi.boolean()
});

function validateTask(task){
    return schema.validate(task);
}

export default validateTask;