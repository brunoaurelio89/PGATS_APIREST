const request = require('supertest');
// const hostUsers = 'http://localhost:3000'
const {faker} = require('@faker-js/faker')


// importação quando definifido o arquivo .env
// tem que comentar a linha 2 desse arquivo para funcionar essa funcionalidade debaixo
require('dotenv').config();
const hostUsers = process.env.URL_USERS;

describe ('Suite de testes do CRUD', ()=>{
    const payloadUsers={
        nome: faker.person.fullName(),
        telefone: faker.phone.number('+55 (##) ####-####'), // Tem como passar uma mascara para gerar um valor randomico conforme a mascara
        email:  faker.internet.email(),
        senha: faker.internet.password()
    }


    let idUser = '';

    //Exercicio XX
    it.only('Cadastrando um novo usuário, consultando e retornando os campos, se foram enviados ',async ()=>{
        const response = await request (hostUsers)
            .post('/users')
            .send(payloadUsers)

            //Verifica a informação do ID do usuário que foi cadastrado e armazena na variavel idUser
            expect(response.body).toHaveProperty('id');
            idUser = response.body.id
            console.log (`ID do Usuário Cadastrado: ${idUser}`)

            //Validação do status
            expect (response.status).toBe(201);
            console.log(response.body)

            //Validação dos dados retornados
            const {id,nome,telefone, email} = response.body
            //Verifica a presença do ID
            expect(id).toBeDefined();

            //Verifica se o valor enviado é o mesmo que foi persistido (recebido)
            expect(nome).toBe(payloadUsers.nome);
            expect(telefone).toBe(payloadUsers.telefone);
            expect(email).toBe(payloadUsers.email);

            //Verifica que a senha não está presente no retorno
            //Por ser um dado sensível não deve ser mostrado no payload após a criação
            expect(response.body.senha).toBeUndefined();

            console.log ('Cadastro do usuário randomico:', response.body)

    })

    // it.only('Alterando a informação do usuário cadastrado alteriromente, verificando se os dados realmente foram alterados', async()=>{
    //     const payloadNewUsers={
    //         nome: faker.person.fullName(),
    //         telefone: faker.phone.number('+55 (##) ####-####'), // Tem como passar uma mascara para gerar um valor randomico conforme a mascara
    //         email:  faker.internet.email(),
    //         senha: faker.internet.password()
    //     }
    //     // alterar todos os registros do payload, vai gerar novos registros randomicos

    //     // receber a varivael no parametro da url do put
    //     const responsePut = await request (hostUsers)
    //         .put(`/users/${idUser}`) // Passa o ID que foi criado do novo usuário
    //         .send(payloadNewUsers)

    //     // armazenar a varivel -- variavel do idUser

    //     // validar status code
    //     expect (responsePut.status).toBe(201);
    //     console.log(response.body)
    //     // validar alteração dos campos
    //     expect(responsePut.body.nome).toBe(payloadNewUsers.nome)
    //     expect(responsePut.body.telefone).toBe(payloadNewUsers.telefone)

    //     // logar resposta
    //     console.log('Usuário Alterado: ', responsePut.body)

    //     //valida a consulta dos dados
    //     const responseGet = await request (hostUsers)
    //         .get(`/users/${idUser}`)

    //     expect(responseGet.status).toBe(200);
    //     expect(responseGet.body.id).toBe(idUser);
    //     expect(responseGet.body.nome).toBe(payloadNewUsers.nome);
    //     expect(responseGet.body.telefone).toBe(payloadNewUsers.telefone)

    // })
    // Exercicio 8 -  Deletar um usuário já cadastrado
    /*it.only('Deverá remover o registro cadastrado anteriormente e retornar status code 204', async()=>{
        const response = await request (hostUsers)
            .delete(`/users/${idUser}`)

        //validar o status code 204
        expect (response.status).toBe(204);
        console.log(response.body.id) // Está retornando Undefined porque o registro não foi encontrado
        console.log('Resposta do delete: ',response.body)

        const responseGet = await request (hostUsers)
            .get(`/users/${idUser}`)

        expect(responseGet.status).toBe(500); // Verifica se a resposta do GetUsers = 500 quando não encontra mais o registro

    })*/

})

// Exercicio 6 - Validação da ausencia de dados
// Tem que retornar a mensagem que é exibida
describe ('Suite de testes do CRUD com dados ausentes', ()=>{
    const payloadUsersNull={
        nome: faker.person.fullName(),
        telefone: faker.phone.number('+55 (##) ####-####'), // Tem como passar uma mascara para gerar um valor randomico conforme a mascara
        email:  null,
        senha: faker.internet.password()
    }
    it.only('Cadastrando um novo usuário, e verificando a ausencia de dados  ',async ()=>{
        const response = await request (hostUsers)
            .post('/users')
            .send(payloadUsersNull)

        //Validação do status
        expect (response.status).toBe(422);
        expect(response.body).toEqual({error: 'Os seguintes campos são obrigatórios: email'})
        console.log(response.body)
    })

})