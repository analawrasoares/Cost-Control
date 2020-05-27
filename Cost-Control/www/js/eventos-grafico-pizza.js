isLogged();
$(document).ready(()=>{
	
	let url = window.location.search;
	url = url.split("&"); 
	const ano = url[0].split("=").pop();
	const mes = url[1].split("=").pop();
	$(`option[value=${mes}]`).attr("selected","selected");
	geraGraficoPizza(ano,mes);

	$("#select-mes-grafico").change(()=>{
		$("#legend-mes").text("");
		mostraLoading();
		geraGraficoPizza(ano,$("#select-mes-grafico").val())
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

	//ARRAY COM LISTA DE CORES PARA REGISTROS DO TIPO SAÍDA
	const tonsS=["#A9A9A9","#191970","#00BFFF","#FF7F50","#48D1CC","#F4A460","#7B68EE","#A020F0","#FF69B4","#DC143C","#FF8C00","#FFD700","#FFFF00"];
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

			obj= {};
			obj.entrada=registro.val().descricao;
			obj.valor= registro.val().valor;
			
			//SE O REGISTRO FOR DO TIPO ENTRADA, DEFINE ESSE PEDACO COM COR VERDE
			if(registro.val().tipo=="entrada"){
				obj.color= am4core.color("#3CB371")
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

