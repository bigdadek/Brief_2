const express = require('express');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  });

