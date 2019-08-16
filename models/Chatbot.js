const mongoose = require('mongoose'), Schema = mongoose.Schema

const chatbotSchema = new Schema({
    name: String,
    categorie: String,
    image: String
})

mongoose.model("Chatbots", chatbotSchema, "Chatbots")