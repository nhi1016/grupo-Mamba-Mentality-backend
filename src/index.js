import Koa from "koa";
import KoaLogger from "koa-logger";
import { koaBody } from "koa-body";
import router from "./routes.js";
import koaCors2 from "koa-cors2";

import dotenv from "dotenv";

dotenv.config();


const app = new Koa();


app.use(koaCors2({ Credentials: true }));

app.use(KoaLogger());
app.use(koaBody());

// Router
app.use(router.routes());

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`app iniciada y escuchando en el puerto ${port}`);
});


