const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');

const router = express.Router();

const upload = multer({ dest: 'public/images', limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/users', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    res.json(response.data.slice(0, 10)); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des utilisateurs');
  }
});

router.get('/users/:id/posts', async (req, res) => {
  try {
    const userId = req.params.id;
    const userResponse = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const postsResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    res.json({ user: userResponse.data, posts: postsResponse.data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des utilisateurs et des posts');
  }
});

router.post('/files', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Aucun fichier envoyé');
  }

  const allowedExtensions = ['.jpeg', '.png'];
  const ext = path.extname(req.file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return res.status(400).send('Extension non autorisée');
  }

  res.json({ message: 'Fichier uploadé avec succès' });
});

router.post('/posts', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const data = JSON.stringify(response.data.slice(0, 10));
    await fs.writeFile('data.json', data);
    res.json({ message: 'Posts stockés dans data.json' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération et du stockage des posts');
  }
});

router.get('/posts', async (req, res) => {
  try {
    const data = await fs.readFile('data.json', 'utf-8');
    const posts = JSON.parse(data);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la lecture du fichier data.json');
  }
});

router.get('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const data = await fs.readFile('data.json', 'utf-8');
    const posts = JSON.parse(data);
    const post = posts.find(post => post.id === parseInt(postId));
    if (!post) {
      return res.status(404).send('Post non trouvé');
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la lecture du fichier data.json');
  }
});
s
module.exports = router;
