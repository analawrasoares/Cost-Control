isLogged();
log(usuario);
$(document).ready(function(){
	
	adicionaAnosNoSelect();


	let ano = new Date().getFullYear();
	let mes = new Date().getMonth();

	geraGraficoPizza(ano,mes);
	
	
	$(`option[value=${mes}]`).attr("selected","selected");
	$(`option[value=${ano}]`).attr("selected","selected");


	$("#select-mes-grafico").change(function(){
		$("#legend-mes").text("");
		mostraLoading();
		
		geraGraficoPizza(ano,$(this).val());
		
	});


	$("#select-ano-grafico").change(function(){
		$("#legend-mes").text("");
		mostraLoading();
		geraGraficoPizza($(this).val(),$("#select-mes-grafico").val());
	});


});


async function geraGraficoPizza(ano,mes){
	// Create chart instance
	am4core.useTheme(am4themes_animated);
	am4core.useTheme(am4themes_material);

	//CRIA O GRÁFICO NA DIV/ID DO PRIMEIRO PARAMENTRO, SEGUNDO PARAMETRO DEFINE O TIPO DE GRÁFICO
	const chart = am4core.create("chartdiv", am4charts.PieChart);
	//CRIANDO OS PEDACOS DO GRÁFICO DE PIZZA
	const sliceSettings = chart.series.push(new am4charts.PieSeries());
	sliceSettings.labels.template.disabled = true;

	const tonsE = ["#4db6ac","#3CB371","#00bfa5","#43a047","#388e3c","#2e7d32","#1b5e20","#00e676","#1de9b6"];

	//ARRAY COM LISTA DE CORES PARA REGISTROS DO TIPO SAÍDA
	const tonsS=["#ef5350","#f44336","#e53935","#d32f2f","#c62828","#b71c1c","#ff1744","#d50000"];
	const dados =[];
	
	//LEGENDA DO GRÁFICO QUE FALA O QUE CADA COR SIGNIFICA				
	chart.legend = new am4charts.Legend();
	
	//DEFININDO ALTURA MAXIMA DA LEGENDA
	chart.legend.maxHeight = 100;
	
	//ATIVANDO SCROLL DA LEGENDA
	chart.legend.scrollable = true;
	
	//FAZENDO O GRÁFICO COM UM BURACO NO MEIO
	chart.innerRadius = am4core.percent(35);
		
	//DEFININDO POR QUAL CHAVE O GRÁFICO IRÁ BUSCAR NO ARRAY DE OBJETOS -PRECISA SER UM VALOR NÚMERICO	
	sliceSettings.dataFields.value = "valor";

	//DEFININDO POR QUAL CHAVE O GRÁFICO IRÁ BUSCAR NO ARRAY DE OBJETOS PARA DIVIDIR OS PEDACOS DO GRÁFICO -PRECISA SER UMA STRING	
	sliceSettings.dataFields.category = "entrada";

	//ATIVANDO FUNCAO QUE PERMITE MUDAR A COR DO GRÁFICO
	sliceSettings.slices.template.propertyFields.fill = "color";

	//DEFININDO A COR DA BORDA/LINHA QUE SEPARA OS PEDACOS 
	sliceSettings.slices.template.stroke = am4core.color("#fff");

	//DEFININDO A GROSSURA DA LINHA
	sliceSettings.slices.template.strokeWidth = 2;

	//DEFININDO A TRANSPARENCIA DA LINHA
	sliceSettings.slices.template.strokeOpacity = 1;
	
	//FAZ A CONSULTA NO BANCO	
	const dadosAux = await firebase.database().ref(`registros/${usuario.id}/${ano}/${mes}`).once("value");

	//SE A CONSULTA RETORNAR NULL, USUARIO NÃO TEM REGISTRO	
	if(!dadosAux.val()){
		escondeLoading();
		$("#not-found").removeAttr("hidden");


	}else{
		//PARA CADA REGISTRO NO MES
		dadosAux.forEach(registro=>{
			console.log(registro.val());
			obj= {};
			obj.entrada=registro.val().descricao;
			obj.valor= registro.val().valor;
			
			//SE O REGISTRO FOR DO TIPO ENTRADA, DEFINE ESSE PEDACO COM COR VERDE
			if(registro.val().tipo=="entrada"){
				obj.color= am4core.color(tonsE[Math.floor(Math.random()*tonsE.length)])
			}else{
				//SELECIONA UMA COR ALEATÓRIA DA LISTA DE CORES PARA REGISTROS DO TIPO SAÍDA
				obj.color= am4core.color(tonsS[Math.floor(Math.random()*tonsS.length)])
			}

			//ADICIONA OBJETO NA LISTA
			dados.push(obj);

		});

		//ADICIONO OS OBJETOS NO GRÁFICO
		chart.data=dados;

		/*[
			{
				"entrada":"conta de luz",
				"valor":170
			},
			{
				"entrada":"salário",
				"valor":1000
			},
			{
				"entrada":"água",
				"valor":60
			}
		]*/

		escondeLoading();
		$("#legend-mes").append("Gastos referente ao mês de "+retornaMes(mes));
		$("#not-found").attr("hidden","hidden");

	}


}

function adicionaAnosNoSelect(){
	rootRef.child("anos").on("child_added",ano=>{
		$("#select-ano-grafico").append(`<option value='${ano.key}'>${ano.key}</option>`);
	})
}