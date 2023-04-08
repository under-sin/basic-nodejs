const http = require("http");
const { URL } = require("url");

// Importa o módulo bodyParser para analisar o corpo das solicitações HTTP
const bodyParser = require("./helpers/bodyParser");

// Importa o array de rotas do arquivo routes.js
const routes = require("./routes");

// Cria o servidor HTTP usando o método createServer do módulo http
const server = http.createServer((request, response) => {
  // Cria uma instância da classe URL usando a URL completa da requisição
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);

  // Registra no console o método HTTP da requisição e o endpoint solicitado
  console.log(
    `Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`
  );

  // Configura o endpoint para usar o parâmetro de consulta "id" se houver dois níveis na URL (por exemplo, "/users/1")
  let { pathname } = parsedUrl;
  let id = null;

  const splitEndpont = pathname
    .split("/")
    .filter((routeItem) => Boolean(routeItem));

  if (splitEndpont.length > 1) {
    pathname = `/${splitEndpont[0]}/:id`;
    id = splitEndpont[1];
  }

  // Procura uma rota correspondente à solicitação do usuário
  const route = routes.find(
    (routeObj) =>
      routeObj.endpoint === pathname && routeObj.method === request.method
  );

  // Extrai os parâmetros da query string e cria um objeto com eles
  const queryParams = Object.fromEntries(parsedUrl.searchParams);

  // Verifica se a rota foi encontrada
  if (route) {
    // Adiciona os parâmetros da query string ao objeto request como a propriedade 'query'
    request.query = queryParams;
    // Adiciona o parâmetro 'id' (se houver) ao objeto request como a propriedade 'params'
    request.params = { id };

    // Adiciona uma função personalizada 'send' ao objeto response para enviar uma resposta em formato JSON
    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { "Content-type": "application/json" });
      response.end(JSON.stringify(body));
    };

    // Analisa o corpo da solicitação, se a solicitação for POST, PUT ou PATCH, e depois chama a função handler da rota correspondente
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      bodyParser(request, () => route.handler(request, response));
    } else {
      // Chama a função handler da rota correspondente
      route.handler(request, response);
    }
  } else {
    // Se a rota não foi encontrada, envia uma resposta com código de erro 404 e uma mensagem de erro
    response.writeHead(404, { "Content-type": "text/html" });
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }
});

// Inicia o servidor na porta 3000 e registra no console uma mensagem informando que o servidor foi iniciado
server.listen(3000, () =>
  console.log("Server started at http://localhost:3000")
);
