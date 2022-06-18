// IMPORTING THE REQUIRED MODULES
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// Importing Custom Modules
const connectToMongo = require('./db');
const User = require('./models/User');

connectToMongo();           // Connecting to mongo



// HOSTNAME AND PORT
const hostname = '127.0.0.1';
const port = 8000;

const app = express();      // STARTING THE EXPRESS SERVER


// EXPRESS SPECIFIC STUFF
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(cors());



// ENDPOINTS --> GET


// ENDPOINTS --> POST

// ROUTE 1: Register a User using: POST /auth-api/register          AUTHENTICATION NOT REQUIRED
app.post('/auth-api/register', async (req, res) => {

    try {
        let { name, username, email, password } = req.body;

        let user_username = await User.findOne({ username: username });
        let user_email = await User.findOne({ email: email });
        let user_both = await User.findOne({ username: username, email: email });

        // const lower_alphabets = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        // const upper_alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        // const num_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        // const special_characters = ["@", "#", "%", "^", "&", "*", "-", "_", "+", "=", "'", "\"", ".", "?", "<", ">"];
        // const all_characters = [...lower_alphabets, ...upper_alphabets, ...num_list, ...special_characters];


        // const lower_alphabets = ["abcdefghijklmnopqrstuvwxyz"];
        // const upper_alphabets = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
        // const num_list = ["1234567890"];
        // const special_characters = ["@#%^&*-_+='\".?<>"];
        // const all_characters = lower_alphabets + upper_alphabets + num_list + special_characters;


        const usernameMinLength = 4;
        const passwordMinLength = 4;
        const usernameMaxLength = 20;
        const passwordMaxLength = 30;


        // Validations
        if ((name == " ") || (name == "") || (name == "  ") || (name == "   ") || (name == "    ") || (name == "     ") || (name == "      ") || (name == "       ") || (name == "        ")) {            // Checks whether the name is blank or not
            res.status(400).json({ errorName: "Invalid Name!" });
        }
        else if ((username.includes(' '))) {            // Checks whether the username includes spaces or not
            res.status(400).json({ errorUsernameSpace: "Username should not contain spaces" });
        }
        else if ((username.length < (usernameMinLength)) || (username.length > (usernameMaxLength))) {          // Checks the length of username
            res.status(400).json({ errorUsernameLength: `Username must be between ${usernameMinLength} - ${usernameMaxLength} Characters` });
        }
        else if (password.length < passwordMinLength || password.length > passwordMaxLength) {                  // // Checks the length of password
            res.status(400).json({ errorPasswordLength: `Password must be between ${passwordMinLength} - ${passwordMaxLength} Characters` });
        }
        else if ((user_username || user_email || user_both)) {           // Checks whether the user exists or not
            res.status(400).json({ errorAlreadyExists: "User already exists" });
        }

        // Creating the user
        else {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password, salt);

            const new_user = await User.create({
                name: name,
                username: username,
                email: email,
                password: secPass
            });

            const data = {
                name: name,
                username: username,
                email: email
            }
            res.status(200).json({ success: true, successRegister: "Your account has been created successfully", data });


        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ errorInternalServer: "Internal Server Error" });
    }
});


// ROUTE 2: Login a User using: POST /auth-api/login          AUTHENTICATION NOT REQUIRED
app.post('/auth-api/login', async (req, res) => {

    try {

        let { username, password } = req.body;

        let user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ errorUserLogin: "User doesn't Exists." });
        }
        else {

            const passwordCompare = await bcrypt.compare(password, user.password);

            if (!passwordCompare) {
                return res.status(400).json({ errorPasswordLogin: "Please try to login with correct credentials." });
            }
            else {

                const data = {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                }

                res.status(200).json({ successLogin: "Successfully logged in", data });

            }
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ errorInternalServer: "Internal Server Error" });
    }
});


// LISTENING THE SERVER
const server = app.listen(port, () => {
    console.log(`The application started on http://${hostname}:${port}/`);
});