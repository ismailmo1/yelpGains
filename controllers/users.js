const User = require('../models/users');

module.exports.registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to Yelp Camp ${username}!`)
            res.redirect('/gyms');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderRegister = async (req, res) => {
    res.render('users/register');
}

module.exports.renderLogin = async (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = async (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || '/gyms'
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('success', 'see ya!')
    res.redirect('/gyms')
}