const userService = require('../services/user');

const createUser = async(req, res) => {
    res.json(await userService.createUser(req.body.name, req.body.email, req.body.password));
}

const getUsers = async (req, res) => {
    res.json(await userService.getUsers());
}

const getUser = async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    if(!user){
        return res.status(404).json({errors : ['Article not found']});
    }
    res.json(user);
}

const updateHistory = async(req, res) => {
    res.json(await userService.updateHistory(req.params.id, req.body.order));
}

const login = (req, res) => {

    res.render('login.ejs');
}


module.exports = {createUser, getUsers, getUser, updateHistory, login};
