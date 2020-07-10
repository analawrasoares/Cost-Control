isLogged();
let objAntigo;
let auxAno="";
let auxMes="";
let auxId="";
const botoes = ["Cancelar","Confirmar"];
log(usuario);
$(document).ready(async function(){
	adicionaAnosNoSelect();
	
	let url = window.location.search;
	

	//FUNCÃO VERIFICA SE O USUÁRIO ESTAR EDITANDO UM REGISTRO OU CRICANDO UM NOVO
	//CASO ESTEJA EDITANDO, A FUNCÃO BUSCA O DADOS NO REGISTRO NO BANCO E SETA NO "objAntigo" E INPUTS
	isEditting(url)

	//EVENTO QUE VERIFICA SE O USUÁRIO DEFINIU O REGISTRO COMO UMA ENTRADA
	//BTN-ENTRADA E BTN-SAIDA SÃO FLAGS
	$("#btn-entrada").click(()=>{
		$("#btn-entrada").addClass("btn-entrada");

		//VERIFICO SE ANTES ELE TINHA DEFINIDO O REGISTRO COMO SAIDA
		if($("#btn-saida").hasClass("btn-saida")){
			$("#btn-saida").removeClass("btn-saida");
		}
	});


	//EVENTO QUE VERIFICA SE O USUÁRIO DEFINIU O REGISTRO COMO UMA SAIDA
	$("#btn-saida").click(()=>{
		$("#btn-saida").addClass("btn-saida");
		
		//VERIFICO SE ANTES ELE TINHA DEFINIDO O REGISTRO COMO ENTRADA    
		if($("#btn-entrada").hasClass("btn-entrada")){
			$("#btn-entrada").removeClass("btn-entrada");

		}
	});

	//EVENTO QUE VERIFICA SE O USUÁRIO SELECIONOU UM MÊS DIFERENTE
	$("#select-mes").change(()=>{
		//PEGO O MÊS E ANO SELECIONADO PELO USUÁRIO
		const mes = $("#select-mes").val();
		const ano = $("#select-ano").val();

		//REMOVO A TABELA REFERENTE AO MÊS ANTIGO
		$("#tabela-entradas tbody").empty();

		//CRIU UMA NOVA TABELA COM O NOVO MÊS SELECIONADO PELO USUÁRIO
		buscaEntradas(mes,ano);

	});

	//EVENTO QUE VERIFICA SE O USUÁRIO SELECIONOU UM ANO DIFERENTE
	$("#select-ano").change(()=>{

		//PEGO O MES E ANO SELECIONADO PELO USUÁRIO
		const ano = $("#select-ano").val();
		const mes = $("#select-mes").val();
		
		//REMOVO A TABELA REFERENTE AO ANO ANTIGO
		$("#tabela-entradas tbody").empty();

		//CRIU UMA NOVA TABELA COM O NOVO ANO SELECIONADO PELO USUÁRIO
		buscaEntradas(mes,ano);

	});


	//EVENTO PARA QUANDO FORMULÁRIO É SUBMETIDO
	$("#form-entrada").submit((e)=>{
		//FUNCAO NÃO DEIXA FORM SER SUBMETIDO
		e.preventDefault();

		//VERIFICO SE O USUÁRIO TENTOU SALVAR REGISTRO SEM DEFINIR SE É ENTRADA OU SAÍDA
		if(!$("#btn-entrada").hasClass("btn-entrada")&&!$("#btn-saida").hasClass("btn-saida")){
			
			//MENSAGEM DE ALERTA DIZENDO PARA DEFINIR SE É UMA ENTRADA OU SAÍDA
			$("span").removeAttr("hidden");
			return false;
		}
		//ATRIBUINDO VALORES DOS INPUTS EM VARIÁVEIS QUE SERÃO DO OBJ QUE VAI SER SALVO NO BANCO
		let tipo="";
		const id =  $("#input-id").val();
		const mes = $("#select-mes").val();
		const ano = $("#select-ano").val();
		let valor = $("#input-valor").val();
		const descricao = $("#input-descricao").val();
		valor = valor.replace(/\./g,"").replace(",",".");
		//TIRA OS PONTOS DA MASCARA E TROCA VÍRGULA POR PONTO E CONVERTE PARA UM FLOAT
		valor = parseFloat(valor); 
		log(valor);
		//DEFINE O TIPO DO REGISTRO (ENTRADA OU SAÍDA)
		$("#btn-entrada").hasClass("btn-entrada")?tipo="entrada":tipo="saida";


		//OBJETO QUE SERÁ SALVO NO BANCO
		const obj={
			
			mes:mes,
			ano:ano,
			tipo:tipo,
			valor:valor,
			descricao:descricao,
			id:id

		}
		//CASO O ID SEJA VÁZIO, USUÁRIO ESTÁ CRIANDO UM NOVO REGISTRO    
		if(obj.id==""){

			//CAMINHO QUE O REGISTRO VAI SER SALVI
			const ref = rootRef.child(`registros/${usuario.id}/${ano}/${mes}`);

			//ID GERADO PELO BANCO
			obj.id = ref.push().key;

			//SALVANDO NO BANCO NO CAMINHO DO REF + ID DA FUNCAO PUSH().KEY
			ref.child(obj.id).set(obj)
			.then(()=>{
				Notificacao.sucesso("Registro salvo com sucesso");
				limpaCampos();

			})
			.catch(erro=>Notificacao.erro(erro));

		}else{

			salvaRegistroEditado(obj,objAntigo);

			
			

		}
			
			
	});


	//EVENTO CASO O USUÁRIO CLIQUE EM ALGUM BOTÃO EXCLUIR 
	$("#tabela-entradas tbody").on("click","#btn-excluir",function(){

		auxId = $(this).val(); 
    	auxAno = $(this).data("ano");
    	auxMes = $(this).data("mes");
    	 
    	navigator.notification.confirm("Tem certeza que deseja remover esse registro?", confirmCallback, "Atenção",botoes);
		
	});


});
function salvaRegistroEditado(obj,objAntigo){

	//VERIFICO SE O USUÁRIO ALTEROU O MÊS E O ANO DO REGISTRO
	if(obj.mes!=objAntigo.mes && obj.ano!=objAntigo.ano){
				
		console.log("alterou o mês e o ano");
		rootRef.child(`registros/${usuario.id}/${obj.ano}/${obj.mes}/${obj.id}`).update(obj)
		.then(()=>rootRef.child(`registros/${usuario.id}/${objAntigo.ano}/${objAntigo.mes}/${objAntigo.id}`).remove())
		.then(()=>{
			Notificacao.sucesso("Registro atualizado com sucesso");
			setTimeout(()=>location.replace('cadastro.html'),1750);
		})
		.catch(erro=>{
			Notificacao.erro(erro)
			console.log(erro);
		});

	}
	//VERIFICO SE O USUÁRIO ALTEROU SÓ O MÊS DO REGISTRO
	else if(obj.mes!=objAntigo.mes && obj.ano==objAntigo.ano){
		console.log("alterou só o mês")
		log(objAntigo)
		rootRef.child(`registros/${usuario.id}/${objAntigo.ano}/${objAntigo.mes}/${objAntigo.id}`).remove()
		.then(()=>rootRef.child(`registros/${usuario.id}/${obj.ano}/${obj.mes}/${obj.id}`).update(obj))
		.then(()=>{
			Notificacao.sucesso("Registro atualizado com sucesso");
			setTimeout(()=>location.replace('cadastro.html'),1750);
		})
		.catch(erro=>{
			console.log(erro);
			Notificacao.erro(erro);
		})
	

	//VERIFICO SE O USUÁRIO ALTEROU SÓ O ANO DO REGISTRO        
	}else if(obj.mes==objAntigo.mes&&obj.ano!=objAntigo.ano){
		console.log("alterou só o ano")
		rootRef.child(`registros/${usuario.id}/${obj.ano}/${obj.mes}/${obj.id}`).update(obj)
		.then(()=>rootRef.child(`registros/${usuario.id}/${objAntigo.ano}/${objAntigo.mes}/${objAntigo.id}`).remove())
		.then(()=>{
			Notificacao.sucesso("Registro atualizado com sucesso");
			setTimeout(()=>location.replace('cadastro.html'),1750);
		})
		.catch(erro=>{
			console.log(erro);
			Notificacao.erro(erro);
		})

	}
	//USUÁRIO NÃO ALTEROU MÊS NEM ANO
	else{
		console.log("não alterou o mês nem o ano")

		const ref = rootRef.child(`registros/${usuario.id}/${obj.ano}/${obj.mes}/${obj.id}`);
		ref.update(obj)
		.then(()=>{
			Notificacao.sucesso("Registro atualizado com sucesso")
			setTimeout(()=>location.replace('cadastro.html'),1750);
		})
		.catch(erro=>Notificacao.erro(erro));
				
	}

}



function limpaCampos(){
	$("#input-valor").val("");

	$("#input-descricao").val("");
}

async function editaRegistro(id,ano,mes){
	const snapshot = await rootRef.child(`registros/${usuario.id}/${ano}/${mes}/${id}`).once("value");
	$(`option[value=${ano}]`).attr("selected","selected");
	$(`option[value=${mes}]`).attr("selected","selected");
	$('#input-valor').mask('000.000.000,00', {reverse: true});
	$(`#input-valor`).val(snapshot.val().valor.toString().replace(".",","));
	$("#input-id").val(id);
	$("#input-descricao").val(snapshot.val().descricao);
	if(snapshot.val().tipo=="entrada"){
		$("#btn-entrada").addClass("btn-entrada");
	}else{
		$("#btn-saida").addClass("btn-saida");
	}
	return snapshot.val();


}


async function isEditting(url){
	if(url!=""){
		urlAux = url.split("&");
		const id = urlAux[0].split("=").pop();
		const ano = urlAux[1].split("=").pop();
		const mes = urlAux[2].split("=").pop();

		//FUNCÃO QUE PREENCHE A TABELA COM OS GASTOS DO ANO E MÉS
		buscaEntradas(mes,ano);
		$('#input-valor').mask('000.000.000,00', {reverse: true});
		//FUNCÃO QUE BUSCA NO BANCO O REGISTRO ESPECÍFICO E COLOCA VALORES NOS INPUT
		objAntigo = await editaRegistro(id,ano,mes);


	}else{

		//PEGANDO O MES E ANO ATUAL PARA O SELECT
		const mes = new Date().getMonth();
		const ano = new Date().getFullYear();
		
		//FUNÇÃO QUE PREENCHE A TEBELA COM OS GASOTS DO MES E ANO        
		buscaEntradas(mes,ano);

		//DEFININDO O MES SELECIONADO 
		$("option[value="+mes+"]").attr("selected","selected");

		//DEFININDO O ANO SELECIONADO
		$("option[value="+ano+"]").attr("selected","selected");
		
		//MÁSCARA PARA O VALOR DA ENTRADA
		$('#input-valor').mask('000.000.000,00', {reverse: true});

	}
}

function adicionaAnosNoSelect(){
	rootRef.child("anos").on("child_added",ano=>{
		$("#select-ano").append(`<option value='${ano.key}'>${ano.key}</option>`);
	})
}