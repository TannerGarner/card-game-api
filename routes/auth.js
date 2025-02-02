import express from 'express';

export const authRouter = express.Router();

authRouter.get('/login', function (req, res, next) {
    res.render('login');
})