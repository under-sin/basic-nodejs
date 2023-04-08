const http = require("http");
const { URL } = require("url");

const routes = require("./routes");

// Cria o servidor HTTP usando o método createServer do módulo http
const server = http.createServer((request, response) => {
  // Cria uma instância da classe URL usando a URL completa da requisição
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);

  // Registra no console o método HTTP da requisição e o endpoint solicitado
  console.log(
    `Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`
  );

  // Procura uma rota correspondente à solicitação do usuário
  const route = routes.find(
    (routeObj) =>
      routeObj.endpoint === parsedUrl.pathname &&
      routeObj.method === request.method
  );

  // Extrai os parâmetros da query string e cria um objeto com eles
  const queryParams = Object.fromEntries(parsedUrl.searchParams);

  // Verifica se a rota foi encontrada
  if (route) {
    // Adiciona os parâmetros da query string ao objeto request como a propriedade 'query'
    request.query = queryParams;
    // Chama a função handler da rota correspondente, passando o objeto request e o objeto response como parâmetros
    route.handler(request, response);
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
