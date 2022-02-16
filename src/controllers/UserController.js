const db = require('../services/config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const tableUsers = 'users';

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "26bd9d1f849131",
      pass: "d911b1840a093c"
    }
});

const usePasswordHashToMakeToken = ({ password: passwordHash, id }) => {
    const secret = `${passwordHash}-${id}`;
    const token = jwt.sign(
        { id },
        secret,
        { expiresIn: 3600 } // 1 hour
    );

    return token;
};

exports.sendPasswordResetEmail = async (req, res) => {
    const { email } = req.params;
    let user;

    try {
        user = await db(tableUsers).select('*').where('email', email).first();
    } catch (error) {
        res.status(404).json('No user with that email');
    }

    const token = usePasswordHashToMakeToken(user);
    const mailOptions = {
        to: email,
        subject: 'Recuperação de Senha - Hitss On',
        text: `Seu link de recuperação de senha: <br /> https://meulink.com/reset/${user.id}/${token}`
    };

    const sendEmail = () => {
        transporter.sendMail(mailOptions, (err, data) => {
            if(err) {
                console.log(`Erro: ${err}`);
                res.status(404).json('Erro interno.')
            } else {
                console.log('E-mail enviado com sucesso!', data.response);
                res.status(200).json('sent');
            }
        });
    };

    sendEmail();
}

exports.receiveNewPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await db(tableUsers).select('*').where('id', id).first();
    const secret = `${user.password}-${id}`;
    const payload = jwt.decode(token, secret);

    if(payload.id === user.id) {
        const hash = await bcrypt.hashSync(password, 10);
        db(tableUsers).update({ password: hash }).where({ id}).then(() => {
            res.status(202).json('Senha atualizada!');
        })
    } else {
        res.status(404).json('Usuário inválido!');
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password)
        return res.status(400).send({ msg: 'Campos inválidos' });

    const user = await db(tableUsers).select('password').where('email', email).first();

    if(!user)
        return res.status(404).send({ error: 'Usuário não encontrado! '});

    if(!(await bcrypt.compareSync(password, user.password)))
        return res.status(401).send({ error: 'Senha inválida' });

    const loggedUser = await db(tableUsers).select('*').where('email', email).first();
    delete loggedUser.password;
    
    const token = jwt.sign(
        { user: loggedUser.id },
        "chave_secreta",
        { expiresIn: 300 }
    );

    return res.status(200).send({ user: { ...loggedUser }, token });
}

exports.post = async (req, res) => {
    try {
        const user = req.body;

        if(!user)
            res.status(400).send('Usuário inválido');
        
        if(!user.first_name)
            res.status(400).send('Usuário com "primeiro nome" inválido');
        
        if(!user.last_name)
            res.status(400).send('Usuário com "último nome" inválido');

        if(!user.email) {
            res.status(400).send('Usuário com "email" inválido');
        } else {
            const hasUser = await db.select().table(tableUsers).where('email', user.email);
            if(hasUser.length)
                res.status(400).send(`E-mail "${user.email}" já cadastrado.`);
        }

        if(!user.cpf) {
            res.status(400).send('Usuário com "CPF" inválido');
        } else {
            const hasUser = await db.select().table(tableUsers).where('cpf', user.cpf);
            if(hasUser.length)
                res.status(400).send(`CPF "${user.cpf}" já cadastrado.`);
        }

        if(!user.password)
            res.status(400).send('Usuário com "email" inválido');

        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;
        const data = await db.insert(user).into(tableUsers);

        res.status(201).send({
            id: data[0],
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            cpf: user.cpf
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

        res.status(200).send(data[0]);
    } catch (error) {
        res.status(500).send({ 
            'message': 'Erro interno no servidor',
            'message-dev': error
        });
    }
}