const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authUsersRouter } = require('./router/auth_users.js');
const { public_users } = require('./router/general.js');

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    if(req.session.authorization) {
        
        let token = req.session.authorization['accessToken']; // Access Token
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
});

const PORT = 5000;

app.use("/customer", authUsersRouter);
app.use("/", public_users);

app.listen(PORT, () => console.log("Server is running"));
