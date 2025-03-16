const exp = require('express');
const adminApp = exp.Router();
const Admin = require('../models/adminModel');
const UserAuthor = require('../models/userAuthorModel');
const Article = require('../models/articleModel');
const expressAsyncHandler = require("express-async-handler");


adminApp.post('/login', expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && admin.password === password) {
        res.send({ message: 'success', payload: admin });
    } else {
        res.status(401).send({ message: 'Invalid credentials' });
    }
}));


adminApp.get('/articles', expressAsyncHandler(async (req, res) => {
    const articles = await Article.find();
    res.send({ message: 'success', payload: articles });
}));


adminApp.get('/users-authors', expressAsyncHandler(async (req, res) => {
    const usersAuthors = await UserAuthor.find();
    res.send({ message: 'success', payload: usersAuthors });
}));

adminApp.put('/users-authors/toggle', expressAsyncHandler(async (req, res) => {
    const { emails, isActive } = req.body;
    await UserAuthor.updateMany(
        { email: { $in: emails } },
        { isActive: isActive }
    );
    res.send({ message: 'success' });
}));

module.exports = adminApp;