const db = require('../services/config/db');
const fs = require('fs');
const tableClasses = 'classes';

exports.post = async (req, res) => {
    try {
        const classData = req.body;

        if(!classData)
            res.status(400).send('Aula inválida');
        
        if(!classData.title)
            res.status(400).send('Aula com "título" inválido');
        
        if(!classData.description)
            res.status(400).send('Aula com "descrição" inválida');

        if(!classData.courseId)
            res.status(400).send('Aula sem vínculo à um curso');

        if(!classData.number)
            res.status(400).send('Aula com "número" inválido');

        const data = await db.insert(classData).into(tableClasses);

        res.status(201).send({
            id: data[0],
            ...classData
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
        const classData = req.body;

        if(!hasClass(id))
            res.status(404).send('Aula não encontrada');

        const data = await db(tableClasses).where({ id: id }).update(classData);
        
        const classUpdated = await db.select().table(tableClasses).where('id', data);

        res.status(200).send(classUpdated[0]);
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

        if(!hasClass(id))
            res.status(404).send('Aula não encontrada');

        const data = await db(tableClasses).where('id', id).del();

        res.status(200).send(`Aula deletada com sucesso!`);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        })
    }
}

exports.get = async (req, res, next) => {
    try {
        const data = await db.select().table(tableClasses);
        
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
        const data = await db.select().table(tableClasses).where('id', id);

        if(!data.length)
            res.status(404).send('Aula não encontrada');

        res.status(200).send(data[0]);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        })
    }
}

exports.videoUpload = async (req, res) => {
    const { id } = req.params;

    if(!hasClass(id))
        res.status(404).send('Aula não encontrada');

    // TODO: excluir vídeo antigo, antes de adicionar o novo

    await db(tableClasses).where('id', id).first().update({ video: req.file.path });

    res.send('Salvo!');
}

exports.getVideoByClassId = async (req, res) => {
    const { id } = req.params;
    const movieFile = await db(tableClasses).where('id', id).first();

    fs.stat(movieFile.video, (err, stats) => {
        if(err) {
            return res.status(404).end('<h1>Vídeo não encontrado :(</h1>');
        }

        const { range } = req.headers;
        const { size } = stats;
        const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
        const end = size - 1;
        const chunkSize = (end - start) + 1;

        res.set({
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        });

        res.status(206);

        const stream = fs.createReadStream(movieFile.video, { start, end });
        stream.on('open', () => stream.pipe(res));
        stream.on('error', (streamErr) => res.end(streamErr));

        return null;
    })
}

const hasClass = async (id = '') => {
    if(!id)
        return false;
    
    const classData = await db.select().table(tableClasses).where('id', id);
 
    return !!classData.length;
}