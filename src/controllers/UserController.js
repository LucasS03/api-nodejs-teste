var db = require('../services/config/db');
const tableUsers = 'users';

exports.post = async (req, res) => {
    try {
        const user = req.body;

        if(!user)
            res.status(400).send('Usuário inválido');
        
        if(!user.first_name)
            res.status(400).send('Usuário com "primeiro nome" inválido');
        
        if(!user.last_name)
            res.status(400).send('Usuário com "último nome" inválido');

        if(!user.email)
            res.status(400).send('Usuário com "email" inválido');

        const data = await db.insert(user).into(tableUsers);

        res.status(201).send({
            id: data[0],
            ...user
        });
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = req.body;

        const data = await db(tableUsers).where({ id: id }).update(user);
        
        const userUpdated = await db.select().table(tableUsers).where('id', data);

        res.status(200).send(userUpdated[0]);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await db(tableUsers).where('id', id).del();

        res.status(200).send(`Usuário deletado com sucesso!`);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        });
    }
}

exports.get = async (req, res, next) => {
    try {
        const data = await db.select().table(tableUsers);
        
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await db.select().table(tableUsers).where('id', id);

        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        });
    }
}