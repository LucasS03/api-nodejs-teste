exports.post = (req, res, next) => {
    res.status(201).send('Rota POST');
};

exports.put = (req, res, next) => {
    let id = req.params.id;
    res.status(201).send(`Rota PUT. ID: ${id}`);
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    res.status(200).send(`Rota DELETE. ID: ${id}`);
}

exports.get = (req, res, next) => {
    res.status(200).send('Rota GET');
}

exports.getById = (req, res, next) => {
    let id = req.params.id;
    res.status(200).send(`Rota GET. ID: ${id}`);
}