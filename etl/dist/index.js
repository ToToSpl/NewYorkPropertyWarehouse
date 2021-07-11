"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const prod_1 = require("./utils/prod");
const sale_1 = require("./entities/sale");
const location_1 = require("./entities/location");
const property_1 = require("./entities/property");
const date_1 = require("./entities/date");
const Loader_1 = require("./resolvers/Loader");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection({
        type: "postgres",
        url: prod_1.__prod__
            ? "postgresql://postgres:postgres@db:5432/dwadms"
            : "postgresql://postgres:postgres@localhost:5432/dwadms",
        logging: !prod_1.__prod__,
        entities: [sale_1.Sale, location_1.Location, property_1.Property, date_1.Date],
        synchronize: true,
    });
    const app = express_1.default();
    if (prod_1.__prod__)
        app.set("trust proxy", 1);
    app.use(cors_1.default({
        origin: prod_1.__prod__ ? "https://domain" : "http://localhost:3000",
        credentials: true,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [
                Loader_1.LoaderResolver
            ],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(4000, () => {
        console.log("Server started");
    });
});
main().catch((err) => console.error(err));
//# sourceMappingURL=index.js.map