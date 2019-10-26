"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_upload_1 = require("graphql-upload");
const graphqlConfig = {
    typePaths: ['./**/*.graphql'],
    installSubscriptionHandlers: true,
    resolvers: { Upload: graphql_upload_1.GraphQLUpload },
    debug: (process.env.GRAPHQL_DEBUG === 'true'),
    playground: (process.env.GRAPHQL_PLAYGROUND === 'true'),
    context: ({ req }) => ({ req }),
};
exports.default = graphqlConfig;
//# sourceMappingURL=graphql.js.map