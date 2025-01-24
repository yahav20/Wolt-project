const bcrypt = require('bcrypt');
const User = require('../models/user');

const createUser = async (name, mail, password, address) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name: name, mail: mail, password: hashedPassword, address:address });
    return await user.save();
};

const getUserById = async (id) => {
    console.log(id);
    return await User.findById(id);
};

const getUsers = async () => {
    return await User.find({});
};

const updateHistory = async (id, order) => {
    const user = await getUserById(id);

    if (!user) return null;

    user.orderHistory += " " + order;
    await user.save();
    return user;
};

const authenticateUser = async (mail, password) => {
    const user = await User.findOne({ mail });
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    return user;
};

module.exports = { createUser, getUserById, getUsers, updateHistory, authenticateUser };
