import dotenv from "dotenv";
dotenv.config();

import Koa from "koa";

const app = new Koa();


const port = process.env.PORT;

app.listen(port, () => {
    console.log(`app iniciada y escuchando en el puerto ${port}`);
});