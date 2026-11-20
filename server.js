const express = require('express');
const path = require('node:path');

const app = express();
const root = __dirname;

app.use('/chutu', express.static(path.join(root, 'Chutu_X_mutt_chachus-bday', 'dist')));
app.use('/mama', express.static(path.join(root, "Mama-b;day", 'dist')));
app.use('/bro', express.static(path.join(root, 'my-bros-birthday-main')));
app.use('/ritika', express.static(path.join(root, "Ritika_mam's_stuff")));
app.use('/papa', express.static(path.join(root, "papa's_b'day", 'data')));

app.get('/', (request, response) => {
  response.sendFile(path.join(root, 'index.html'));
});

app.listen(process.env.PORT || 10000, '0.0.0.0');
