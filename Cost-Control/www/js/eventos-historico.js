isLogged();
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
        tipo="btn btn-success"
        classeSpan="fas fa-plus";
    }else{
        tipo="btn btn-danger";
        classeSpan="fas fa-minus";
    }

    const linha =`<tr id=${registro.key}>
                    <td><button class='${tipo}'><span class='${classeSpan}'></span></button></td>
                    <td>${registro.val().descricao}</td>
                    <td>${registro.val().valor}</td>
                    
                </tr>`;
    return linha;
}