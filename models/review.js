const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    content: String,
    bookId: String,
    authorId: String
});

module.exports = mongoose.model('Review', reviewSchema);
