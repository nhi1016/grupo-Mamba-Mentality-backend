const Koa = require('koa');
const KoaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const koaCors2 = require('koa-cors2');
const router = require('./routes.js');
const dotenv = require('dotenv');

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
