// serve para encapsular funções assicronas, evita repetição de "try catch"
// retorna a função com catch next
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}