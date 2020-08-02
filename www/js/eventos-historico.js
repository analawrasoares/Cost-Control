isLogged();
log(usuario);
let auxAno="";
let auxMes="";
let auxId="";
const botoes = ["Cancelar","Confirmar"];

$(document).ready(function(){
	
	
	adicionaAnosNoSelect();
	//PEGO A DATA ATUAL E SETO NO SELECT
	let mes = new Date().getMonth();
	let ano = new Date().getFullYear();
	$(`option[value=${mes}]`).attr("selected","true")
	$(`option[value=${ano}]`).attr("selected","true")


	//FUNCAO QUE BUSCA NO BANCO OS REGISTROS COM OS SEGUINTES MESES E ANOS
	buscaEntradas(mes,ano);

	//EVENTO CASO O USUÁRIO ESCOLHA UM OUTRO MÊS NO SELECT, TRAZ OS NOVOS REGISTROS
	$("#select-mes").change(evento=>{
		mes = evento.target.value;
		mostraLoading()
		buscaEntradas(mes,ano);
	});
	
	//EVENTO CASO O USUÁRIO ESCOLHA UM OUTRO ANO NO SELECT, TRAZ OS NOVOS REGISTROS
	$("#select-ano").change(evento=>{
		ano = evento.target.value;
		mostraLoading()
		buscaEntradas(mes,ano);
	});

    //EVENTO CASO O USUÁRIO CLIQUE EM ALGUM BOTÃO EXCLUIR 
    $("#tabela-historico tbody").on("click","#btn-excluir",function(){
    	auxId = $(this).val(); 
    	auxAno = $(this).data("ano");
    	auxMes = $(this).data("mes");

    	navigator.notification.confirm("Tem certeza que deseja remover esse registro?", confirmCallback, "Atenção",botoes);
            
    });

})





