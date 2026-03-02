const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const { typeDefs, resolvers } = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();
const PORT = 4000;

mongoose.connect('mongodb://localhost:27017/graphql-practice', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.on('error', console.error.bind(console, "connection errror :"));
mongoose.connection.once('open', () =>
    console.log('Connected to Database')
);

const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async () => {
    await server.start();

    app.use('/graphql', cors(), express.json(), expressMiddleware(server));

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}/graphql`);
    });
};

startServer();