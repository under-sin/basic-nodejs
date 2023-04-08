function bodyParser(request, callback) {
  // Define uma string vazia para conter o corpo da solicitação
  let body = "";

  // Configura um listener de eventos para a solicitação, ouvindo o evento "data"
  request.on("data", (chunk) => {
    // Adiciona cada pedaço de dados recebido da solicitação à string `body`
    body += chunk;
  });

  // Configura um listener de eventos para a solicitação, ouvindo o evento "end"
  request.on("end", () => {
    // Analisa a string `body` como um objeto JSON
    body = JSON.parse(body);

    // Atribui o objeto analisado à propriedade `body` do objeto de solicitação
    request.body = body;

    // Chama o callback para indicar que a análise do corpo da solicitação está concluída
    callback();
  });
}

// Exporta a função `bodyParser` para que possa ser usada em outros módulos
module.exports = bodyParser;
