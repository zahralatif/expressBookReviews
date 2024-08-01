const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    //Write the authenication mechanism here
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; //* Extract the token from the Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    jwt.verify(token, 'mysecretkey123jwt', (err, user) => { //* Verify the token
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }

        req.user = user; //* Store the user object in the request object
        next();
    });
});

app.use("/customer/auth/*", auth); //* Apply the auth middleware

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
