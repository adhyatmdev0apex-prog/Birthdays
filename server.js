const express = require('express');
const path = require('node:path');

const app = express();
const root = __dirname;

const sites = [
  ['/chutu', path.join(root, 'Chutu_X_mutt_chachus-bday', 'dist')],
  ['/mama', path.join(root, "Mama-b;day", 'dist')],
  ['/bro', path.join(root, 'my-bros-birthday-main')],
  ['/ritika', path.join(root, "Ritika_mam's_stuff")],
  ['/papa', path.join(root, "papa's_b'day", 'data')]
];

app.get('/', (request, response) => {
  response.sendFile(path.join(root, 'index.html'));
});

for (const [route, directory] of sites) {
  app.use(route, express.static(directory));
}

app.listen(process.env.PORT || 10000, '0.0.0.0');
