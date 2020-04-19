$(document).ready(function(){


    //EVENTOS CADASTRO DE ENTRADA

    //PEGANDO O MES E ANO ATUAL PARA O SELECT
    const mes = new Date().getMonth();
    const ano = new Date().getFullYear();
    //DEFININDO O MES SELECIONADO 
    $("option[value="+mes+"]").attr("selected","selected");
    //DEFININDO O ANO SELECIONADO
    $("option[value="+ano+"]").attr("selected","selected");
    
    //MÁSCARA PARA O VALOR DA ENTRADA
    $('#input-valor').mask('000.000.000,00', {reverse: true});
    
    $("#form-entrada").submit((e)=>{
        e.preventDefault();
        if(!$("#btn-entrada").hasClass("btn-entrada")&&!$("#btn-saida").hasClass("btn-saida")){
            $("span").removeAttr("hidden");
            return false;
        }
        let tipo="";
        const id =  $("#input-id").val();
        const mes = $("#select-mes").val();
        const ano = $("#select-ano").val();
        let valor = $("#input-valor").val();
        const descricao = $("#input-descricao").val();
        valor = parseFloat(valor.replace(".","").replace(",","."));
        $("#btn-entrada").hasClass("btn-entrada")?tipo="entrada":tipo="saida";

        const obj={
            mes:mes,
            ano:ano,
            tipo:tipo,
            valor:valor,
            descricao:descricao,
            


        }
        
        const ref = firebase.database().ref(`registros/1/${ano}/${mes}`);
        obj.id = ref.push().key;
        ref.push().set(obj)
        .then(()=>{
            Notificacao.sucesso("Registro salvo com sucesso")
            limpaCampos();

        })
        .catch(erro=>Notificacao.erro(erro));
        
    });


    $("#btn-entrada").click(()=>{
        $("#btn-entrada").addClass("btn-entrada");

        if($("#btn-saida").hasClass("btn-saida")){
            $("#btn-saida").removeClass("btn-saida");
        }
    });

    $("#btn-saida").click(()=>{
        $("#btn-saida").addClass("btn-saida");
        
        if($("#btn-entrada").hasClass("btn-entrada")){
            $("#btn-entrada").removeClass("btn-entrada");

        }
    });


    firebase.database().ref("registros/1/"+ano+"/"+mes).on("child_added",snapshot=>{

        $("#tabela-entradas tbody").append(criaLinhaEntradas(snapshot));
            
    });

    //FUNÇÃO QUE EXCLUI O USUÁRIO DO SISTEMA
    $("#tabela-users").on("click","#btn-excluir",function(){
        excluiuser($(this).val());
        
    });


    //EVENTOS PAGINA CADASTRO USER 
        
    var url = location.search;
    if(url!=""){
        let id = url.slice(4);
        console.log(id);
        trazDadosUser(id);
    }
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
        excluiuser($(this).val());
        
    });
    //TODA VEZ QUE UM NOVO USUÁRIO É ADICIONADO AO BANCO ESSA FUNÇÃO ADICIONA O MESMO NA TABELA
    firebase.database().ref("usuarios").on("child_added",novoUser=>{
        $("#tabela-users:tbody").append(criaLinha(novoUser));
    });

    //TODA VEZ QUE UM USUÁRIO É EXCLUIDO DO BANCO ESSA FUNÇÃO O REMOVE DA TABELA
    firebase.database().ref("usuarios").on("child_removed",user=>{
        $("#"+user.key).fadeOut(()=>$("#"+user.key).remove());
    });


});
function criaLinhaEntradas(registro){
    const linha =`<tr id=${registro.key}>
                    <td>${registro.val().descricao}</td>
                    <td>${registro.val().tipo}</td>
                    <td>${registro.val().valor}</td>
                    <td><a href="cadastroUsuario.html?id=${registro.key}" class='btn btn-primary text-uppercase font-weight-bold'>Editar <span class='fas fa-edit'></span></a></td>
                    <td><button id='btn-excluir' value='${registro.key}' class='btn btn-danger text-uppercase font-weight-bold'>Excluir <span class='fas fa-trash'></span</button></td>
                </tr>`;
    return linha;
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

function excluiRegistro(id){
    firebase.database().ref("registro/1/"+id).remove()
    .then(()=>Notificacao.sucesso("Usuário excluido com sucesso!"))
    .catch(erro=>{
        console.log(erro);
        Notificacao.erro(erro);
    })
}

function trazDadosUser(id){

    firebase.database().ref("usuarios/"+id).once("value",user=>{
        console.log(user.val());
        $("#input-nome").val(user.val().nome);
        $("#input-cpf").val(user.val().cpf);
        $("#input-email").val(user.val().email);
        $("#input-id").val(user.key);
    })
}
function limpaCampos(){
    $("#input-valor").val("");

    $("#input-descricao").val("");
}