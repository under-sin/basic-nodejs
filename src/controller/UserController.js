const { users } = require("../mocks/users");

module.exports = {
  listUsers(request, response) {
    // Extrai o parâmetro de consulta "order" da solicitação
    const { order } = request.query;

    // Classifica o array de usuários com base no parâmetro "order"
    const sortedUsers = users.sort((a, b) => {
      if (order === "desc") {
        // Se o parâmetro "order" for "desc", classifica em ordem decrescente
        return a.id < b.id ? 1 : -1;
      }

      // Caso contrário, classifica em ordem crescente (padrão)
      return a.id > b.id ? 1 : -1;
    });

    // Envia uma resposta com código 200 e o conteúdo do array de usuários classificado em formato JSON
    response.writeHead(200, { "Content-type": "application/json" });
    response.end(JSON.stringify(users));
  },
};
