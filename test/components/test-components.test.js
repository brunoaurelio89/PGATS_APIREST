const request = require('supertest');
const hostContent = 'http://localhost:3000';
const {faker} = require('@faker-js/faker')

describe('Suite de teste para os componentes CRUD - CREATE, READ, UPDATE E DELETE',()=> {
    //Aqui dentro fica o Create e Read, que sempre vai ser executado para que possa ocorrer as demais validações dos outros "its".
    //Create - Sempre cria um novo conteúdo
    beforeAll(async()=>{
        //Utilizado para fazer o cadastro de um novo conteúdo
        const payloadContent = {
            titulo: faker.commerce.productName(),
            descricao: faker.commerce.productDescription(),
            tipoConteudo: faker.commerce.productAdjective(),
            conteudo: faker.commerce.productMaterial()
        }
        const responsePost = await request(hostContent)
            .post('/conteudos')
            .send(payloadContent)

        //Verifica se tem a propriedade id e passa o id do registro criado para a variável
        expect(responsePost.body).toHaveProperty('id');
        idContent = responsePost.body.id

        //Verifica se o statusCode é igual a 201 - conteúdo cadastrado
        expect(responsePost.status).toBe(201);

        //READ - Validação dos dados cadastrado
        const {id,titulo, descricao, tipoConteudo, conteudo} = responsePost.body;
        expect(id).toBeDefined();

        // Verifica se o valor que foi enviado no payload é o mesmo que foi cadastrado
        expect(titulo).toBe(payloadContent.titulo);
        expect(descricao).toBe(payloadContent.descricao);
        expect(tipoConteudo).toBe(payloadContent.tipoConteudo);
        expect(conteudo).toBe(payloadContent.conteudo)

        console.log(`Informações do contéudo cadastrado: `,responsePost.body)
    })

    //Utilizado para fazer alteração das informações do conteúdo
    const payloadNewContent = {
        titulo: faker.commerce.productName(),
        descricao: faker.commerce.productDescription(),
        tipoConteudo: faker.commerce.productAdjective(),
        conteudo: faker.commerce.productMaterial()
    }

    //Utilizado para fazer alteração com campos faltante e/ou em branco
    //Passando o campo descrição = null e não passando o campo tipoConteudo no payload
    const payloadFailContent = {
        titulo: faker.commerce.productName(),
        descricao: null,
        //tipoConteudo: faker.commerce.productAdjective(),
        conteudo: faker.commerce.productMaterial()
    }

    let idContent = ''; //Para guardar a variável do id do conteúdo
    const idFailContent = '8888'; //Para verificar um conteúdo que não foi cadastrado
    const idInvalidContent = '99999'; //Para verificar um conteúdo que não existe

    it('READ | GET - Realiza a consulta de um contéudo por ID, deve retornar Status 404 e mensagem que o conteúdo com o id informado não foi localizado', async()=>{
        const responseGet = await request(hostContent)
            .get(`/conteudos/${idFailContent}`)

        //Verifica se o StatusCode para o códido do conteúdo é 404
        expect(responseGet.status).toBe(404);
        console.log('Mensagem da consulta Get com um código não encontrado: ',responseGet.body)
    })

    it('UPDATE | PUT - Realiza a alteração dos dados do último registro do componente que foi cadastrado, deve mostrar Status Code 201', async()=>{

        const responsePut = await request(hostContent)
           .put(`/conteudos/${idContent}`)
           .send(payloadNewContent)

        //Verifica se o statusCode é igual a 201 - conteúdo alterado
        expect(responsePut.status).toBe(201);

        //Validação dos dados retornados
        const {id,titulo, descricao, tipoConteudo, conteudo} = responsePut.body;
        expect(id).toBeDefined();

        //Validação dos dados alterados
        expect(titulo).toBe(payloadNewContent.titulo);
        expect(descricao).toBe(payloadNewContent.descricao);
        expect(tipoConteudo).toBe(payloadNewContent.tipoConteudo);
        expect(conteudo).toBe(payloadNewContent.conteudo)
        //Mostra as informações que foram alteradas
        console.log(`Informações da alteração do conteúdo: `,responsePut.body)
    })

    it('UPDATE | PUT - Realiza alteração com campos faltantes ou em branco, deve retornar Status Code 422 e mostrar mensagem de erro', async()=>{
        const responseFailPut = await request(hostContent)
            .put(`/conteudos/${idContent}`)
            .send(payloadFailContent)

        //Verifica se o StatusCode é igual a 422 - Campos faltantes ou em branco
        expect(responseFailPut.status).toBe(422)
        //Verifica se a mensagem aparesentada é a mesma da documentação
        expect(responseFailPut.body).toEqual({ error: "Os seguintes campos são obrigatórios: descricao, tipoConteudo"});
        console.log('Mensagem do put quando falta campo ou está null: ', responseFailPut.body);
    })

    it('DELETE | DELETE - Realiza a remoção do cadastro do novo componente que foi adicionado, deve retornar Status Code 200', async()=>{

        const responseDelete = await request(hostContent)
            .delete(`/conteudos/${idContent}`)

        // Verifica se o StatusCode é igual a 200
        expect(responseDelete.status).toBe(200);
        console.log('Mensagem do delete com sucesso: ',responseDelete.body)
    })

    it('DELETE | DELETE - Realiza a validação da mensagem caso não encontre o ID para ser removido, deve retornar Status Code 404 e mostrar mensagem de erro', async()=>{
        const responseDelete = await request(hostContent)
            .delete(`/conteudos/${idInvalidContent}`)

        // Verifica se o StatusCode é igual a 404 - Não encontrado
        expect(responseDelete.status).toBe(404);
        //Verifica se a mensagem apresentada é a mesma da documentação
        expect(responseDelete.body).toEqual({ error: "Erro ao excluir o conteúdo, o conteúdo não foi encontrado."});
        console.log('Mensagem do delete com falha: ',responseDelete.body)
    })

});
