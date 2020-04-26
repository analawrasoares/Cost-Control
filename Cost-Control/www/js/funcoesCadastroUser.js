$(document).ready(function(){



    //EVENTOS PAGINA CADASTRO USER 
        
    var url = location.search;
    if(url!=""){
        let id = url.slice(4);
        trazDadosUser(id);
    }

    $("#input-cpf").mask("000.000.000-000");

    //ADM CLICOU EM SALVAR
    $("#form-user").submit((evento)=>{

        //NÃO DEIXA O FORMULÁRIO SER ENVIADO

        evento.preventDefault();
        if(url!=""){
            //OBJETO USUÁRIO PARA SER SALVO NO BANCO
            user={
                nome:$("#input-nome").val(),
                cpf:$("#input-cpf").val(),
                email:$("#input-email").val(),
                id:$("#input-id").val()

            };

            salvaUser(user,null);

        }else{
            //OBJETO USUÁRIO PARA SER SALVO NO BANCO
            user={
                nome:$("#input-nome").val(),
                cpf:$("#input-cpf").val(),
                email:$("#input-email").val(),
                id:$("#input-id").val(),
                senha:Math.floor(Math.random() * 65536)  + 32768
            };
            
            //OBJETO EMAIL COM AS INFORMAÇÕES PARA SEREM MANDADAS VIA EMAIL
            objEmail={
                Host: "smtp.gmail.com",
                Username : "costcontrolproject@gmail.com",
                Password : "trabalhodojean123",
                To : user.email,
                From : "costcontrolproject@gmail.com",
                Subject : "Senha",
                Body : "Sua senha é:" + user.senha 
            };

            salvaUser(user,objEmail);

        }

    });

    //FUNÇÃO QUE EXCLUI O USUÁRIO DO SISTEMA
    $("#tabela-users").on("click","#btn-excluir",function(){
        if(confirm("Tem certeza que deseja remover esse usuário?")){
            excluiuser($(this).val());

        }
        
    });
    //TODA VEZ QUE UM NOVO USUÁRIO É ADICIONADO AO BANCO ESSA FUNÇÃO ADICIONA O MESMO NA TABELA
    firebase.database().ref("usuarios").on("child_added",novoUser=>{
        $("#tabela-users tbody").append(criaLinha(novoUser));
    });

    //TODA VEZ QUE UM USUÁRIO É EXCLUIDO DO BANCO ESSA FUNÇÃO O REMOVE DA TABELA
    firebase.database().ref("usuarios").on("child_removed",user=>{
        $("#"+user.key).fadeOut(()=>$("#"+user.key).remove());
    });

});



function trazDadosUser(id){

    firebase.database().ref("usuarios/"+id).once("value",user=>{
        console.log(user.val());
        $("#input-nome").val(user.val().nome);
        $("#input-cpf").val(user.val().cpf);
        $("#input-email").val(user.val().email);
        $("#input-id").val(user.key);
    })
}



function criaLinha(user){

    const linha = `<tr id=${user.key}>
                    <td>${user.val().nome}</td>
                    <td>${user.val().cpf}</td>
                    <td>${user.val().email}</td>
                    <td><a href="cadastroUsuario.html?id=${user.key}" class='btn btn-primary text-uppercase font-weight-bold'>Editar <span class='fas fa-edit'></span></a></td>
                    <td><button id='btn-excluir' value='${user.key}' class='btn btn-danger text-uppercase font-weight-bold'>Excluir <span class='fas fa-trash'></span</button></td>
                </tr>`;

    return linha;
}

function salvaUser(user,objEmail){

    //CASO O ID ESTEJA VÁZIO SIGNIFICA QUE É UM USUÁRIO NOVO
    if(user.id==""){

        //CONECTA COM O BANCO E CRIA UMA CHAVE PRIMÁRIA COM O MÉTODO PUSH E EM SEGUIDA SALVA USUÁRIO NO BANCO
        firebase.database().ref("usuarios").push().set(user)

        //CASO SALVE COM SUCESSO APARECE MENSAGEM DE SUCESSO E MANDA EMAIL PARA USUÁRIO 
        .then(()=>{
            Notificacao.sucesso("Usuário cadastrado com sucesso!");
            return Email.send(objEmail);
        })

        //CASO CONSIGA MANDAR EMAIL PARA O USUÁRIO APARECE MENSAGEM DE SUCESSO
        .then(()=>Notificacao.sucesso("Email enviado com sucesso"))
            
        //CASO TENHA DADO ALGUM ERRO EM ALGUMA OPERCAÇÃO ACIMA O ERRO SERÁ MOSTRADO NO CONSOLE E NA NOTIFICAÇÃO
        .catch(erro=>{
            console.log(erro);
            Notificacao.erro(erro);
        });

    }else{

        //CONECTA COM O BANCO E ATUALIZA OS DADOS DO CLIENTE
        firebase.database().ref("usuarios/"+user.id).update(user)

        //CASO SALVE COM SUCESSO APARECE MENSAGEM DE SUCESSO E MANDA EMAIL PARA USUÁRIO 
        .then(()=>{
            
            Notificacao.sucesso("Usuário atualizado com sucesso!");
            //ESPERA UMA QUANTIDADE DE SEGUNDOS E REDIRECIONA PARA A PÁGINA INICIAL
            return sleep(1500)
            
        })
        .then(()=>location.replace("cadastroUsuario.html"))

        //CASO TENHA DADO ALGUM ERRO EM ALGUMA OPERCAÇÃO ACIMA O ERRO SERÁ MOSTRADO NO CONSOLE E NA NOTIFICAÇÃO
        .catch(erro=>{
            console.log(erro);
            Notificacao.erro(erro);
        });

    }

    
}
function sleep(ms) {
    
    return new Promise(resolve => setTimeout(resolve, ms));

}

function excluiuser(id){
    firebase.database().ref("usuarios/"+id).remove()
    .then(()=>Notificacao.sucesso("Usuário excluido com sucesso!"))
    .catch(erro=>{
        console.log(erro);
        Notificacao.erro(erro);
    })
}