const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function likeRequest(request, response, next) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id,
  );

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }
  request.body.likes = repositories[repositoryIndex].likes;

  return next();
}

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.json(repository);
});

//UPDATE
app.put('/repositories/:id', likeRequest, (request, response) => {
  const { id } = request.params;
  const { title, url, techs, likes } = request.body; //Valores vindos da requisição
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id,
  );

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id,
  );
  if (repositoryIndex < 0) {
    return response.status(400).send();
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const repository = repositories.find((repository) => repository.id === id);
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id,
  );
  if (repositoryIndex < 0) {
    return response.status(400).send();
  }
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
