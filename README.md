

# Social Network API

A social network API that allows users to register, create, and like posts.

## Documentation

[Click here](https://documenter.getpostman.com/view/26593761/2s9Y5YR2Pg)

## Front End for this project

[Click here](https://github.com/s-mendes/labeddit)

## How to Use the API

To use the API, you need to have Node.js and SQLite installed. In the `./src/database/` folder, create the `database.db` file and create the tables according to the queries in the `querys.sql` file. Create the `.env` file and configure it according to the example. Now, in the terminal within the main folder, execute the `npm install` command to install the dependencies and `npm start` to start the API. If everything is working correctly, you will see the message "Server is running on port ****." After this step, all endpoints in the documentation will be available.

## Available Endpoints

Here are the available endpoints in the API:

-   **Users:**
    
    -   `POST /users/signup`: Create a new user on the platform.
    -   `POST /users/login`: Log in with an existing user on the platform.
-   **Posts:**
    
    -   `POST /posts`: Create a new post.
    -   `GET /posts`: Get all posts on the platform.
    -   `PUT /posts/:id`: The user who created the post can edit it.
    -   `DELETE /posts/:id`: The user who created the post or an Admin can delete the post.
    -   `PUT /posts/:id/like`: The user can like or dislike a post.

## Contribution

If you encounter any issues or have suggestions to improve the API, please feel free to open an issue or submit a pull request. Thank you for your contribution to making the API even better!

## TRADUZIDO EM PORTUGUÊS


# Rede Social API

Uma API de rede social que permite o usuário cadastrar, criar e curtir publicações. 

## Documentação

[Click here ](https://documenter.getpostman.com/view/26593761/2s9Y5YR2Pg)

## Front End para este projeto

[Clicl here](https://github.com/s-mendes/labeddit)

## Como Usar a API

Para utilizar a API você precisa ter instalado o Node.js e SQLite, na pasta `./src/database/` crie o arquivo `database.db` e crie as tabelas de acordo com as querys do arquivo `querys.sql`. Crie o arquivo `.env`e configure de acordo com o exemplo. Agora no terminal dentro da pasta principal, execute o comando `npm install` para instalar as dependências e `npm start`para iniciar a API. Caso esteja tudo funcionando, aparecerá a mensagem `Servidor rodando na porta ****`. Após este passo, todos endpoints da documentação estarão disponíveis.

## Endpoints Disponíveis

Aqui estão os endpoints disponíveis na API:

- **Usuários:**
    - `POST /users/signup`: Crie um novo usuário na plataforma.
    - `POST /users/login`: Faça login com usuário existente na plataforma.

- **Post:**
    - `POST /posts`: Cria um novo post.
    - `GET /posts`: Obtenha todos os posts da plataforma.
    - `PUT /posts/:id`: Usuário que criou o post pode editar o post.
    - `DELETE /posts/:id`: Usuário que criou o post ou um Admin pode deletar o post.
    - `PUT /posts/:id/like`: O usuário pode dar um Like ou Dislike em um post.

## Contribuição

Se você encontrar algum problema ou tiver sugestões para melhorar a API, fique à vontade para abrir uma issue ou enviar um pull request. Agradeço sua contribuição para tornar API ainda melhor!
