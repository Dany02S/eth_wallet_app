const router = require('express').Router()
const authenticateUser = require('../middlewares/Authenticate')
const Joi = require('joi')
const { GoogleGenerativeAI} = require("@google/generative-ai")
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

router.post('/', authenticateUser, async (req, res) => {
    try {
        const { error } = validation(req.body); 
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
})

const validation = (data) => {
    const schema = Joi.object({
        message: Joi.string().required(),
        history: Joi.array().required()
    });
    return schema.validate(data);
}

module.exports = router

