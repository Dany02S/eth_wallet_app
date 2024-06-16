const { User, Account, Transaction } = require('../models/models');
const bcrypt = require('bcrypt');
const { loginValidation, registerValidation, talkWithAIValidation } = require('../utils/validations');
const { GoogleGenerativeAI} = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

exports.getUserPage = async (req, res) => {
    const userId = req.userId
    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });  
        const accounts = await Account.find({ user_id: userId });

        transactions = await Transaction.find({ 
          $or: [{ sender_address: { $in: accounts.map(account => account.address) } }, 
              { receiver_address: { $in: accounts.map(account => account.address) } }] 
        });

        const data = {
            user : {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                two_factor: user.two_factor_enabled
        },
        accounts: accounts,
        transactions : transactions
      };
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message});

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send({ message: "User not found"});

        const validPassword = await bcrypt.compare(req.body.password, user.password_hashed);
        if (!validPassword) return res.status(404).send({ message: "Invalid password" });

        if (user.two_factor_enabled) {
            return res.status(200).send({ 
                user_id: user._id, 
                message: "Login successful, redirectiong to the 2FA" });
        } else {
            const token = user.generateAuthToken(user._id);
            return res.status(200).send({ token: token, user_id: user._id, message: "Login successful" });
        }
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
}

exports.registerUser = async (req, res) => {
    try {
        const { error } = registerValidation(req.body); 
        if (error) return res.status(400).send({ message: error.details[0].message});

        const user = await User.findOne({ email: req.body.email });
        if (user) return res.status(409).send({ message: 'User already exists'});
        
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        new_user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password_hashed: hashedPassword,
            two_factor_secret: '',
            two_factor_enabled: req.body.two_factor_enabled
        }
        const new_userm = await new User(new_user).save();

        const token = new_userm.generateAuthToken(new_userm._id);
        
        return res.status(201).send({ 
            message: req.body.two_factor_enabled ? 'User created with 2FA' : 'User created',
            user_id: new_userm._id,
            token: token, 
            two_factor_enabled: req.body.two_factor_enabled
        });
        
    } catch (error) {
        res.status(500).send({ message: error.message});
    }
}

exports.talkWithAI = async (req, res) => {
    try {
        const { error } = talkWithAIValidation(req.body); 
        if (error) return res.status(400).send({ message: error.details[0].message});

        const model = genAI.getGenerativeModel({model: "gemini-pro" })

        const chat = model.startChat({
            history: req.body.history,
            maxOutputTokens: 100,
        })

        const mess = req.body.message
        const result = chat.sendMessage(mess)
        const response = (await result).response
        res.send({ message: response.text()})

    } catch (error) {
        res.status(500).send({ message: error.message})
    }
}