/**
 * AuthController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require("passport");
module.exports = {
    login: function (req, res) {
        res.view("auth/login");
    },
    process: function (req, res) {
        //console.log(passport.authenticate.toString());
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return res.send({ message: 'An error occurred while logging in.' });
            }
            //if (!user) { return res.redirect('/signin') }
            if ((err) || (!user)) {
                return res.send({
                    message: 'login failed'
                });
                res.send(err);
            }
            req.logIn(user, function (err) {
                if (err) res.redirect('/login');
                return res.redirect('/');
            });
        })(req, res);
    },

    logout: function (req, res) {
        req.logout();
        res.send('logout successful');
    },
    account: function (req, res) {
        res.view("auth/account");
    },
    processAccount: function (req, res) {
        //email exists?

        User.findOne({ email: req.body.email }).done(function (err, user) {

            if (!user || user.length < 1) {
                //create new user
                if (req.body.password1 == req.body.password2) {
                    User.create({email: req.body.email, password: req.body.password1}).done(function (err, user) {
                        if (err) {
                            res.render('500', { status: 500, url: req.url, message: 'An error occurred while creating the account. Please try later.' });
                        }
                        res.view("auth/verify", {user: user});
                    });
                } else {
                    res.view("auth/account", { message: 'The passwords must be identical.'});
                }
            } else {

                res.view('auth/account_existing');
            }
        });
    },
    _config: {}
};
