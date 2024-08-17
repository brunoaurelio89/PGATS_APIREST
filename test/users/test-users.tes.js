const request = require('supertest');

const host = "http://localhost:3000";

describe ('Suite de teste de api users ...', ()=>{

        // Pode criar uma função isolada com os dados do JSON para reutilizar
        const jsonArquivoCadastroUsers = {
            nome: "bruno aurelio",
            telefone: "(73)99873322",
            email: "brunoarueeeee@teste4.com",
            senha: "96585"
        }

        const jsonVazio ={
            nome: "",
            telefone: "",
            email: "",
            senha: ""
        }
        const jsonDadosAusentes ={
            nome: "Bruno Aurelio",
            telefone: "",
            email: "bru@test.com",
            senha: "12358"
        }
     

        let idusuario = '';
        

        it('Consulta todos os usuários cadastrados...deve retornar 200', async()=>{
            const response = await request(host).get('/users');
            expect(response.status).toBe(200);
            // Para trazer o retorno do body da resposta
            console.log(response.body);
        })

        //it.only = roda somente o teste que está com o only
        it('Criar um novo usuário...deve retornar 200', async()=>{
            const response = await request(host)
            .post('/users')                 // rota
            .send(jsonArquivoCadastroUsers) // dados que são enviados pelo body
            
            expect(response.status).toBe(201); //toBe = Esperar que o status seja == 200
            // Para trazer o retorno do body da resposta
            console.log(response.body);
            })

        it('Verificar se um usuário já está cadastrado...deve retornar 422', async()=>{
            const response = await request(host)
            .post('/users')                 // rota
            .send(jsonArquivoCadastroUsers) // dados que são enviados pelo body
            
            expect(response.status).toBe(422); //toBe = Esperar que o status seja == 200
            // Para trazer o retorno do body da resposta
            console.log(response.body);
            })

        it('Envia os dados vazios e deve retornar um status 422', async () => {
            const response = await request(host)
                .post('/users')
                //precisamos construir os dados que queremos enviar
                .send(jsonVazio)
            expect(response.status).toBe(422);
            // expect(response.body).toBe('{"error": "Os seguintes campos são obrigatórios: nome, telefone, email, senha"}');
            expect(response.body.error).toBe("Os seguintes campos são obrigatórios: nome, telefone, email, senha");
            console.log(response.body)
        });
    
        
        it('Criar um novo usuário...deve retornar 200', async()=>{
            const response = await request(host)
            .post('/users')                 // rota
            .send(jsonArquivoCadastroUsers) // dados que são enviados pelo body
            
            expect(response.status).toBe(200); //toBe = Esperar que o status seja == 200
            // expect(response.body).toEqual(jsonArquivoCadastroUsers);
            console.log(response.body);
            })

        // it('Consulta todos as atividades cadastradas...deve retornar 200', async()=>{
        //     const response = await request(host).get('/activities');
        //     expect(response.status).toBe(200);
        //     // Para trazer o retorno do body da resposta
        //     console.log(response.body);
        // })


        // Atividade 3 Exercicio 1
        it('Criar um novo usuário...deve retornar 201... deve retornar a resposta que foi enviada no body', async()=>{
            const response = await request(host)
            .post('/users')                 // rota
            .send(jsonArquivoCadastroUsers) // dados que são enviados pelo body
            
            expect(response.status).toBe(201); //toBe = Esperar que o status seja == 200
            expect(response.body); // retorna os dados que foram enviados
            // expect(response.body).toEqual(jsonArquivoCadastroUsers);
            console.log(response.body);
        })


        // Atividade 3 Exercicio 2
        it('Criar um novo usuário com dados ausentes...deve retornar 422, deve retornar no body a mensagem de erro', async()=>{
            const response = await request(host)
            .post('/users')                 // rota
            .send(jsonDadosAusentes) // dados que são enviados pelo body
            expect(response.body);
            expect(response.status).toBe(422); //toBe = Esperar que o status seja == 200
            // expect(response.body).toEqual(jsonArquivoCadastroUsers);
            console.log(response.body);
            })

        // Atividade 4 - Exercicio 1
        // Esse contém dois it's (um para cadastrar novo usuário e outro para fazer o login)
        //
        it('Criar um novo usuário...deve retornar 201... deve retornar a resposta que foi enviada no body', async()=>{
            const response = await request(host)
            

            .post('/users')                 // rota
            .send(jsonArquivoCadastroUsers) // dados que são enviados pelo body
            //Após o cadastro deve guardar o resultado em uma variavel que já deve estar definida

            expect(response.body).toBeDefined();
            expect(response.body).toHaveProperty('id'); // verifica se existe a propriedade definida
            expect(response.body); // retorna os dados que foram enviados
            
            expect(response.status).toBe(201); //toBe = Esperar que o status seja == 200
            idusuario = response.body.id
            console.log('Usuário cadastrado', idusuario)



            console.log(response.body);
        })

        it('Deve consultar o usuário que foi cadastrado e logar o registro do usuário cadastrado com o retorno', async()=>{
            const response = await request(host)
            .get(`/users/${idusuario}`);                  // rota para consultar o usuário, tem que estar com crase e não aspas, porque está passando uma variavel
     
            
            expect(response.status).toBe(200); 
            expect(response.body).toBeDefined();
            expect(response.body).toHaveProperty('id', idusuario);
            expect(response.body); 
            console.log(`Usuário retornado: `,response.body);
        })
            
        //Exercicio 7
        it ('Alterando o registro cadastrado anteriormente', async()=>{
            // com a variavel armazenada, chame o metodo put, passando o paylod com a alteração do nome do usuário
            // não esqueça de passar todos os campos que sejam obrigatórios

               // utilizado no exercicio 7
            const jsonAlteraNomeUsuario ={
            nome: "Bruno Aurelio",
            telefone: "(73)99873322",
            email: "brunoarueeeee@teste4.com",
            senha: "12358"
            }

            const responseUpdate = await request(host)
            .put(`/users/${idusuario}`)
            .send(jsonAlteraNomeUsuario)

            expect(responseUpdate.status).toBe(201);
            expect(responseUpdate.body.nome).toBe(jsonAlteraNomeUsuario.nome) // verifica se o nome que foi alterado é o mesmo do payload que foi passado

            console.log(`Usuário Alterado: `,responseUpdate.body); // mostra a informação no payload que foi alterado o nome

        })

})


