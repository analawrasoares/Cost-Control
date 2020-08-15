isLogged();

$(document).ready(function () {

	adicionaAnosNoSelect();

	const anoAtual = new Date().getFullYear();
	geraGraficoBarra(anoAtual);

	$(`option[value='${anoAtual}']`).attr("selected", "selected");


	$("#select-ano").change(function () {
		mostraLoading();
		geraGraficoBarra($(this).val());
	});


});

async function geraGraficoBarra(ano) {
	//GRÁFICO APARECE COM ANIMACÃO
	am4core.useTheme(am4themes_animated);

	//CRIA O GRÁFICO NA DIV/ID DO PRIMEIRO PARAMENTRO, SEGUNDO PARAMETRO DEFINE O TIPO DE GRÁFICO
	const chart = am4core.create("chartdiv", am4charts.XYChart);
	chart.cursor = new am4charts.XYCursor();

	//DEFINININDO OS COMO AS BARRAS SERÃO CATEGORIZADAS NO EIXO Y
	const categoriaY = chart.yAxes.push(new am4charts.CategoryAxis());

	//DEFININDO POR QAUL CHAVE O GRÁFICO IRÁ BUSCAR NO ARRAY DE OBJETOS
	categoriaY.dataFields.category = "mes";

	//TEXTO QUE APARECE EM BAIXO DO GRÁFICO
	categoriaY.title.text = "Meses";

	//LINHA DO Y QUE DEFINE OS NÚMEROS E TEXTO QUE VÃO APAREER DO LADO ESQUERDO DO GRÁFICO 	
	const valoresEntrada = chart.xAxes.push(new am4charts.ValueAxis());

	//TEXO QUE VAI APARECER NO LADO ESQUERDO DO GRÁFICO
	valoresEntrada.title.text = "R$";

	//CRIANDO AS COLUNAS DE ENTRADA/ESQUERDA REFERENTE A CADA MÊS
	const entrada = chart.series.push(new am4charts.ColumnSeries());

	//DEFININDO POR QUAL CHAVE O GRÁFICO IRÁ BUSCAR NO ARRAY DE OBJETOS - PRECISA SER VALOR NÚMERICO
	entrada.dataFields.valueX = "entrada";

	//DEFININDO POR QUAL CHAVE O GRÁFICO IRÁ BUSCAR NO ARRAY DE OBJETOS - PRECISA SER STRING
	entrada.dataFields.categoryY = "mes";

	//DEFININDO A COR DA COLUNA DE ENTRADA - VERDE
	entrada.columns.template.fill = am4core.color("#3CB371");

	//DEFININDO O QUE SERÁ MOSTRADO QUANDO USUÁRIO PASSAR O MAUSE/CLICAR NA BARRA
	entrada.columns.template.tooltipText = "Receita:{entrada}";

	//CRIANDO AS COLUNAS DE ENTRADA/ESQUERDA REFERENTE A CADA MÊS
	const saida = chart.series.push(new am4charts.ColumnSeries());

	//DEFININDO POR QUAL CHAVE O GRÁFICO IRÁ BUSCAR NO ARRAY DE OBJETOS - PRECISA SER VALOR NÚMERICO
	saida.dataFields.valueX = "saida";

	//DEFININDO O QUE SERÁ MOSTRADO QUANDO USUÁRIO PASSAR O MAUSE/CLICAR NA BARRA
	saida.columns.template.tooltipText = "Despesa:{saida}"

	//DEFININDO POR QUAL CHAVE O GRÁFICO IRÁ BUSCAR NO ARRAY DE OBJETOS - PRECISA SER STRING
	saida.dataFields.categoryY = "mes";

	//DEFININDO A COR DA COLUNA DE ENTRADA - VERDE
	saida.columns.template.fill = am4core.color("#FF4500");

	//LEGENDA DO GRÁFICO QUE FALA O QUE CADA COR SIGNIFICA
	chart.legend = new am4charts.Legend();

	//ARRAY QUE CONTERÁ OBJETOS DO BANCO
	const dados = [];

	//FAZ CONSULTA NO BANCO 	
	const meses = await firebase.database().ref(`registros/${usuario.id}/${ano}`).once("value");

	//SE FOR NULL QUER DIZER QUE O USUÁRIO NÃO TEM REGISTRO NO BANCO
	if (!meses.val()) {
		//ESCONDE MENSAGEM "TOTAL DE GASTOS..."
		$("legend").attr("hidden", "hidden");
		escondeLoading()
		//MOSTRA MENSAGEM "NENHUM REGISTRO ENCONTRADO"
		$("#not-found").addClass("animated fadeIn");
		$("#not-found").removeAttr("hidden");

	} else {

		//PERCORRO CADA MÊS 
		meses.forEach(mes => {
			const obj = {
				entrada: 0,
				saida: 0
			};

			//FUNCÃO QUE FALA A QUAL MêS PERTENCE O MÊS. EX: 0-JANEIRO
			obj.mes = retornaMes(mes.key);

			//PERCORRO CADA REGISTRO DO MES
			mes.forEach(registro => {
				// SE O REGISTRO FOR DO TIPO ENTRADA, ADICIONA NO VALOR ENTRADA
				if (registro.val().tipo == "entrada") {
					obj.entrada += registro.val().valor;
				} else {
					obj.saida += registro.val().valor;
				}
			});

			//ADICIONA OBJETO NO ARRAY
			dados.push(obj);
		});
		escondeLoading();
		$("legend").removeAttr("hidden");
		$("#not-found").attr("hidden", "hidden");

		//ADICIONA A LISTA DE OBJETOS NO GRÁFICO.
		//COMO É A LISTA DE OBJETOS
		/*[
			{
				"mes":"Janeiro",
				"entrada":1000,
				"saida":600
			},
			{
				"mes":"Fevereiro",
				"entrada":1000,
				"saida":800
			},
			{
				"mes":"Marco",
				"entrada":1000,
				"saida":800
			}

		]*/


		chart.data = dados;

	}

}

