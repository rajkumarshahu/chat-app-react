// const express = require('express');
// const router = express.Router();
var Router = require('koa-router');
var router = new Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


// Load User Model
const User = require('../../models/User');

// @routes      GET api/users/test
// @description TESTS users route
// @access      Public

router.get('/api/users/test', async(ctx) => {
    ctx.body = 'users works';
});

// @routes      GET api/users/register
// @description TESTS Register route
// @access      Public
router.post('/api/users/login', async(ctx) => {
    const { errors, isValid } = validateLoginInput(ctx.body);

    // Check Validation
    if (!isValid) {
        return ctx.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = 'Email already exists';
                return ctx.status(400).json(errors);
            } else {
                const avatar = gravatar.url(ctx.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // Default
                })
                const newUser = new User({
                    name: ctx.body.name,
                    email: ctx.body.email,
                    avatar,
                    password: ctx.body.password
                });



                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => ctx.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});

// @routes      GET api/users/login
// @description Login user / Returning JWT Token
// @access      Public
router.post('/api/users/login', async(ctx) => {
    const { errors, isValid } = validateLoginInput(req.body);


    // Check Validation
    if (!isValid) {
        return ctx.status(400).json(errors);
    }

    const email = ctx.body.email;
    const password = ctx.body.password;

    // Find user by email
    User.findOne({ email })
        .then(user => {
            // Check for user
            if (!user) {
                errors.email = 'User not found!!!';
                return res.status(404).json(errors);
            }
            // Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User Matched
                        const payload = { id: user.id, user: user.name, avatar: user.avatar } // Create JWT Payload

                        // SIgn Token
                        jwt.sign(payload,
                            keys.secretOrKey, { expiresIn: 3600 },
                            (err, token) => {
                                ctx.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                            });
                    } else {
                        errors.password = 'Opps incorrect password!!!';
                        return ctx.status(400).json(errors);
                    }
                });
        });
});

// @routes      GET api/users/current
// @description Return current user
// @access      Private
router.get('/api/users/current', passport.authenticate('jwt', { session: false }), async (ctx, next) =>{
    ctx.json({
        id: next.user.id,
        name: next.user.name,
        email: next.user.email
    });
});


module.exports = router;