# Screencast RAG por Fabio Vedovelli

Assistir a aula aqui: [https://youtu.be/PtkzAQD2UzA](https://youtu.be/PtkzAQD2UzA)

IMPORTANTE: este repositório NÃO é um Monorepo.

- **client/**: contém o projeto da aplicação que é acessada pelo browser, usuário final. É uma aplicação React Router 7 (modo framework). Para acessa-la utilize o terminal, acesse a pasta `client/` e execute `npm install` e `npm run dev`, o que tornará a aplicação disponível na porta 5173.

- **server/**: contém o projeto de servidor, responsável por operacionalizar o chatbot e fazer a pesquisa no DB vetorial. Para acessa-la utilize o terminal, acesse a pasta `server/` e execute `npm install` e `npm run dev`, o que tornará a aplicação disponível na porta 4111.

Ambos os projetos possuem o arquivo `.env.example`, que deve ser `salvo como` .env e ter as variáveis de ambiente preenchidas com os valores fornecidos pelos serviços relacionados.
