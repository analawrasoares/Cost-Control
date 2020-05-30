isLogged();
log(usuario)
$(document).ready(function(){

	//PEGO A DATA ATUAL E SETO NO SELECT
	let mes = new Date().getMonth();
	let ano = new Date().getFullYear();
	$(`option[value=${mes}]`).attr("selected","true")
	$(`option[value=${ano}]`).attr("selected","true")


	//FUNCAO QUE BUSCA NO BANCO OS REGISTROS COM OS SEGUINTES MESES E ANOS
	buscaRegistros(mes,ano);

	//EVENTO CASO O USUÁRIO ESCOLHA UM OUTRO MÊS NO SELECT, TRAZ OS NOVOS REGISTROS
	$("#select-mes").change(evento=>{
		mes = evento.target.value;
		mostraLoading()
		buscaRegistros(mes,ano);
	});
	
	//EVENTO CASO O USUÁRIO ESCOLHA UM OUTRO ANO NO SELECT, TRAZ OS NOVOS REGISTROS
	$("#select-ano").change(evento=>{
		ano = evento.target.value;
		mostraLoading()
		buscaRegistros(mes,ano);
	});

    //EVENTO CASO O USUÁRIO CLIQUE EM ALGUM BOTÃO EXCLUIR 
    $("#tabela-historico tbody").on("click","#btn-excluir",function(){

        if(confirm("Tem certeza que deseja remover esse registro?")){
            const mes =$(this).data("mes");
            const ano = $(this).data("ano");
            const id = $(this).val();

            //TODA VEZ QUE UM REGISTRO É EXCLUIDO DO BANCO ESSA FUNÇÃO O REMOVE DA TABELA
            rootRef.child(`registros/${usuario.id}/${ano}/${mes}`).on("child_removed",snapshot=>{

                $("#"+id).fadeOut(function(){
                    $(this).remove();
                });
            });

            excluiRegistro(ano,mes,id);    
            
        }
        
    });

})


//FUNÇÃO RESPONSÁVEL POR BUSCAR OS REGISTROS NO BANCO NO MÊS E ANO PASSADOS COMO PARÂMETROS
function buscaRegistros(mes,ano){

    rootRef.child(`registros/${usuario.id}/${ano}/${mes}`).on("value",snapshot=>{
        
        escondeLoading();

        //REMOVE A ANTIGA LISTA DE REGISROS
        excluiTabela();

        //ADICIONA UMA LINHA NA TABELA COM AS INFORMAÇOES DO NOVO REGISTRO
        snapshot.forEach(registro=>{
            $("#tabela-historico tbody").append(criaLinhaEntradas(registro))
        });
        
            
    });
}
function criaLinhaEntradas(registro){
    let tipo="";
    let classeSpan="";
    //DEFININDO SE O BOTÃO REFERENTE AO TIPO DO REGISTRO SERÁ VERDE OU VERMELHO
    if(registro.val().tipo=="entrada"){
        tipo="btn btn-outline-success"
        classeSpan="fas fa-plus";
    }else{
        tipo="btn btn-outline-danger";
        classeSpan="fas fa-minus";
    }

    const linha =`<tr id=${registro.key}>
                    
                    <td>${registro.val().descricao}</td>
                    <td>${registro.val().valor}</td>
                    <td><button class='${tipo}'><span class='${classeSpan}'></span></button></td>
                    <td><a href='cadastro.html?id=${registro.key}&ano=${registro.val().ano}&mes=${registro.val().mes}'>
                            <button class='btn btn-outline-primary'><span class='fas fa-edit'></span></button>
                        </a>
                    </td>
                    <td><button data-mes='${registro.val().mes}' data-ano='${registro.val().ano}' value='${registro.key}' id='btn-excluir' class='btn btn-outline-danger'><span class='fas fa-trash'></span></button></td>
                    
                </tr>`;
    return linha;
}

function excluiRegistro(ano,mes,id){
    rootRef.child(`registros/${usuario.id}/${ano}/${mes}/${id}`).remove()
    .then(()=>Notificacao.sucesso("Usuário excluido com sucesso!"))
    .catch(erro=>{
        console.log(erro);
        Notificacao.erro(erro);
    })
}