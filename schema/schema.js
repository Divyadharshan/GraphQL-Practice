const Book = require('../models/book');
const Author = require('../models/author');
const Review = require('../models/review');

const typeDefs = `
    type Book {
        id: ID!
        name: String
        genre: String
        author: Author
        reviews: [Review]
    }

    type Review {
        id: ID!
        content: String
        book: Book
        author: Author
    }

    type Author {
        id: ID!
        name: String
        age: Int
        books: [Book]
    }

    type Query {
        book(id: ID!): Book
        author(id: ID!): Author
        books: [Book]
        authors: [Author]
    }

    type Mutation {
        addAuthor(name: String!, age: Int!): Author
        addBook(name: String!, genre: String!, authorId: ID!): Book
        updateBook(id: ID!, name: String, genre: String): Book
        updateAuthor(id: ID!, age: Int): Author
        addReview(bookId: ID!, content: String!, authorId: ID!): Review
    }
`;

const resolvers = {
    Query: {
        book: async (parent, args) => await Book.findById(args.id),
        author: async (parent, args) => await Author.findById(args.id),
        books: async () => await Book.find({}),
        authors: async () => await Author.find({}),
    },
    Mutation: {
        addAuthor: async (parent, args) => {
            let author = new Author({ name: args.name, age: args.age });
            return await author.save();
        },
        addBook: async (parent, args) => {
            let book = new Book({ name: args.name, genre: args.genre, authorId: args.authorId });
            return await book.save();
        },
        updateBook: async (parent, args) => {
            const tbupdated = {};
            if (args.name !== undefined) {
                tbupdated.name = args.name;
            }
            if (args.genre !== undefined) {
                tbupdated.genre = args.genre;
            }
            return await Book.findByIdAndUpdate(args.id, { $set: tbupdated }, { new: true });
        },
        updateAuthor: async (parent, args) => {
            const tbupdated = {};
            if (args.age !== undefined) {
                tbupdated.age = args.age;
            }
            return await Author.findByIdAndUpdate(args.id, { $set: tbupdated }, { new: true });
        },
        addReview: async (parent, args) => {
            let review = new Review({ bookId: args.bookId, content: args.content, authorId: args.authorId });
            return await review.save();
        }
    },
    Book: {
        author: async (parent) => await Author.findById(parent.authorId),
        reviews: async (parent) => await Review.find({ bookId: parent.id })
    },
    Author: {
        books: async (parent) => await Book.find({ authorId: parent.id })
    },
    Review: {
        book: async (parent) => await Book.findById(parent.bookId),
        author: async (parent) => await Author.findById(parent.authorId)
    }
};

module.exports = { typeDefs, resolvers };