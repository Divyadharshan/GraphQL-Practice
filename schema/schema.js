const Book = require('../models/book');
const Author = require('../models/author');

const typeDefs = `
    type Book {
        id: ID!
        name: String
        genre: String
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
    }

    type Mutation {
        addAuthor(name: String!, age: Int!): Author
        addBook(name: String!, genre: String!, authorId: ID!): Book
    }
`;

const resolvers = {
    Query: {
        book: async (parent, args) => await Book.findById(args.id),
        author: async (parent, args) => await Author.findById(args.id)
    },
    Mutation: {
        addAuthor: async (parent, args) => {
            let author = new Author({ name: args.name, age: args.age });
            return await author.save();
        },
        addBook: async (parent, args) => {
            let book = new Book({ name: args.name, genre: args.genre, authorId: args.authorId });
            return await book.save();
        }
    },
    Book: {
        author: async (parent) => await Author.findById(parent.authorId)
    },
    Author: {
        books: async (parent) => await Book.find({ authorId: parent.id })
    }
};

module.exports = { typeDefs, resolvers };