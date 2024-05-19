//IMPORTS
import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import conectarBD from "./db/db.js";
import { types } from "./graphql/types.js";
import { resolvers } from "./graphql/resolvers.js";
import { validateToken } from './utils/tokenUtils.js';

//VARIABLES DE ENTORNO
dotenv.config();
//OBTENER TOKEN , VALIDAR TOKEN
const getUserData = (token) => {
  const verificacion = validateToken(token.split(' ')[1]);
  if (verificacion.data) {
    return verificacion.data;
  } else {
    return null;
  }
};

//ACTIVACIÓN DE APOLLO COMO SERVIDOR DE GRAPHQL
const server = new ApolloServer({
  typeDefs: types, //types en lugar de tipos? 
  resolvers: resolvers,
  context: ({ req }) => {
    const token = req.headers?.authorization ?? null;
    if (token) {
      const userData = getUserData(token);
      if (userData) {
        return { userData };
      }
    }
    return null;
  },
});

//ACTIVACIÓN DE EXPRESS
const app = express();

app.use(express.json());

//ACTIVACIÓN DE CORS
app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running');
});

//CONFIGURACIÓN DE SERVIDOR
app.listen({ port: process.env.PORT || 4000 }, async () => {
  await conectarBD();
  await server.start();

  server.applyMiddleware({ app });

  console.log("servidor listo");
});

/*CONEXIÓN BASE DE DATOS
const main = async () => {
  await conectarBD();
  CONEXIÓN PRUEBA
  await UserModel.create({
    correo: "carlos@email.com",
    identificacion: "1104865957",
    nombre: "carlos",
    apellido: "Camargo",
  })
    .then((u) => {
      console.log("Usuario creado", u);
    })
    .catch((e) => {
      console.error("Error creando el usuario", e);
    });
};main();*/
