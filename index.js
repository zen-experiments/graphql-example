'use strict';

const {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    globalIdField,
    fromGlobalId
} = require('graphql');

const rqp = require('request-promise');

const CONFIG = {
    baseUrl: 'http://localhost:3500',
    json: true
};

const requestPromise = rqp.defaults(CONFIG);

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields() {
        return {
            id: {type: GraphQLString},
            name: {type: GraphQLString}
        };
    }
});

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields() {
        return {
            id: {type: GraphQLString},
            title: {type: GraphQLString},
            author: {
                type: AuthorType,
                resolve: (article) => {
                    const {author} = article;
                    const {id} = author;
                    return requestPromise.get({url: `authors/${id}`});
                }
            }
        };
    }
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields() {
        return {
            author: {
                type: AuthorType,
                args: {
                    id: {
                        type: GraphQLString
                    }
                },
                resolve(author, args) {
                    const {id} = args;
                    return requestPromise.get({url: `authors/${id}`});
                }
            },
            article: {
                type: ArticleType,
                args: {
                    id: {
                        type: GraphQLString
                    }
                },
                resolve(article, args) {
                    const {id} = args;
                    return requestPromise.get({url: `articles/${id}`});
                }
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: QueryType,
});

const query = `
    {
        article(id: "2") {
            title
            author {
                name
            }
        }
    }
`;

graphql(schema, query).then((response) => {
    console.log(JSON.stringify(response, null, 4));
});
