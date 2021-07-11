import express from "express";
import { createConnection } from "typeorm";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { __prod__ } from "./utils/prod";
import { Sale } from "./entities/sale";
import { Location } from "./entities/location";
import { Property } from "./entities/property";
import { Date } from "./entities/date";
import { LoaderResolver } from "./resolvers/Loader";

const main = async () => {
  await createConnection({
    type: "postgres",
    url: __prod__
      ? "postgresql://postgres:postgres@db:5432/dwadms"
      : "postgresql://postgres:postgres@localhost:5432/dwadms",
    logging: !__prod__,
    entities: [Sale, Location, Property, Date],
    synchronize: true,
  });

  const app = express();

  if (__prod__) app.set("trust proxy", 1);

  app.use(
    cors({
      origin: __prod__ ? "https://domain" : "http://localhost:3000",
      credentials: true,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        LoaderResolver
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
};

main().catch((err) => console.error(err));
