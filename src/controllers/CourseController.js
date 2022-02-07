var db = require('../services/config/db');
const tableCourses = 'courses';

exports.post = async (req, res) => {
    try {
        const course = req.body;

        if(!course)
            res.status(400).send('Curso inválido');
        
        if(!course.title)
            res.status(400).send('Curso com "título" inválido');
        
        if(!course.description)
            res.status(400).send('Curso com "descrição" inválida');

        const data = await db.insert(course).into(tableCourses)

        res.status(201).send({
            id: data[0],
            ...course
        });
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        })
    }
};

exports.put = async (req, res, next) => {
    try {
        const id = req.params.id;
        const course = req.body;

        const data = await db(tableCourses).where({ id: id }).update(course);
        
        const courseUpdated = await db.select().table(tableCourses).where('id', data);

        res.status(200).send(courseUpdated[0]);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        })
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await db(tableCourses).where('id', id).del();

        res.status(200).send(`Curso deletado com sucesso!`);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        })
    }
}

exports.get = async (req, res, next) => {
    try {
        const data = await db.select().table(tableCourses);
        
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        })
    }
}

exports.getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await db.select().table(tableCourses).where('id', id);

        res.status(200).send(data[0]);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        })
    }
}