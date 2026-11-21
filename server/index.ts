import { app } from './app';

const port = Number(process.env.PORT ?? 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT deve ser uma porta válida.');
}

app.listen(port, '127.0.0.1', () => {
  console.log(`API disponível em http://127.0.0.1:${port}`);
});
