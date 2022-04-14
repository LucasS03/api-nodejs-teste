const pdf = require('html-pdf');
var db = require('../services/config/db');

const tableCourses = 'courses';
const tableClasses = 'classes';
const tableProgress = 'progress';
const tableCourseStatus = 'course_status';
const tableUsers = 'users';

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

exports.getClassesByCourseId = async (req, res, next) => {
    try {
        const { id } = req.params;

        if(!id)
            res.status(400).send({ 'message': 'id do curso não informado' });

        const data = await db(tableClasses).select().where('courseId', id);

        if(!data.length)
            res.status(400).send({ 'message': 'Curso não existe ou não há aulas para este curso' });
        
        const sortedData = data.sort((a, b) => (a.number >= b.number ? 1 : -1));

        res.status(200).send(sortedData);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        })
    }
}

exports.checkProgress = async (req, res) => {
    const { courseId, userId } = req.params;

    db(tableProgress).where({ courseId, userId }).first().then((data) => {
        if(!data)
            return res.status(200).send({ lastSeen: 0 });

        return res.status(200).send({ lastSeen: data.lastSeen || 0 });
    })
}

exports.updateProgress = async (req, res) => {
    const { courseId, userId } = req.params;
    const { body } = req;

    const data = await db(tableProgress).where({ courseId, userId }).first();

    if(!data) {
        await db(tableProgress).insert({
            courseId, userId, lastSeen: body.lastSeen, id: `${userId}-${courseId}`
        })
    } else {
        await db(tableProgress).where({ courseId, userId }).first().update({ lastSeen: body.lastSeen });
    }

    return res.status(200).send('progress updated');
}

exports.addToCourse = async (req, res) => {
    const { courseId, userId } = req.params;
    const data = await db(tableCourseStatus).where({ courseId, userId }).first();

    if(!data) {
        await db(tableCourseStatus).insert({
            courseId, userId, status: 1
        });
    } else {
        await db(tableCourseStatus).where({ courseId, userId }).first().update({ status: 1 });
    }

    return res.status(200).send('user added to course');

}

exports.setCompleted = async (req, res) => {
    const { courseId, userId } = req.params;
    const { body } = req;
    const data = await db(tableCourseStatus).where({ courseId, userId }).first();

    if(!data) {
        return res.status(400).json({ error: 'O usuário não está cadastrado neste curso!'});
    }

    await db(tableCourseStatus).where({ courseId, userId }).first().update({ completeDate: body.completeDate, status: 2 });
    return res.status(200).send('Curso finalizado!');
}

exports.checkStatus = (req, res) => {
    const { courseId, userId } = req.params;
    const status = [
        { code: 0, status: 'Não Cadastrado' },
        { code: 1, status: 'Cursando' },
        { code: 2, status: 'Concluído' }
    ];

    db(tableCourseStatus).where({ courseId, userId }).first().then((data) => {
        if(!data) {
            return res.status(200).send(status[0]);
        }

        return res.status(200).send(status[data.status]);
    })
} 

exports.generatePDF = async (req, res) => {
    const { courseId, userId } = req.params;
    const course = await db.select().table(tableCourses).where({ id: courseId }).first();
    const user = await db.select().table(tableUsers).where({ id: userId }).first();

    const html = `
    <div style="position: absolute;height: 50%;width: 100%;top: 25%;right: 0;">
        <h4 style="font-size: 28px;text-align: center;">Hitss On</h4>
        <h1 style="font-size: 48px;text-align: center;">Certificado</h1>
        <h2 style="font-size: 32px;text-align: center;">${user.first_name} ${user.last_name}</h2>
        <h3 style="font-size: 28px;text-align: center;"><b>Concluíu o curso ${course.title}<b></h3>
    </div>`;

    const options = {
        type: 'pdf',
        format: 'A4',
        orientation: 'landscape'
    };

    pdf.create(html, options).toBuffer((err, buffer) => {
        if(err) {
            return res.status(500).json(err);
        }

        return res.end(buffer);
    })
}