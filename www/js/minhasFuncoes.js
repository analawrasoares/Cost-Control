const log = console.log;
const usuario = getUserFromLS();


function retornaMes(mes) {
	if (mes == 0) {
		return "Janeiro";
	}
	if (mes == 1) {
		return "Fevereiro";
	}
	if (mes == 2) {
		return "Marco";
	}
	if (mes == 3) {
		return "Abril";
	}
	if (mes == 4) {
		return "Maio";
	}
	if (mes == 5) {
		return "Junho";
	}
	if (mes == 6) {
		return "Julho";
	}
	if (mes == 7) {
		return "Agosto";
	}
	if (mes == 8) {
		return "Setembro";
	}
	if (mes == 9) {
		return "Outubro";
	}
	if (mes == 10) {
		return "Novembro";
	}
	if (mes == 11) {
		return "Dezembro";
	}
}

function escondeLoading() {
	$("#img-loading").removeClass("d-block");
	$("#img-loading").addClass("d-none");
}

function excluiTabela() {
	$("table tbody").empty();
}
function mostraLoading() {
	$("#img-loading").removeClass("d-none");
	$("#img-loading").addClass("d-block");
}


function logOut() {
	localStorage.clear();
	location.replace("login.html");
}

function logIn(user) {

	localStorage.user = JSON.stringify(user);
	const usuario = JSON.parse(localStorage.user);


	location.replace("index.html");
}

function isLogged() {
	if (!localStorage.user) {
		location.replace("login.html")
	};
}

function getUserFromLS() {
	let user = {};
	if (localStorage.user) {
		user = JSON.parse(localStorage.user);

	}
	return user;


}

function encripta(dados) {
	let mensx = "";
	let l;
	let i;
	let j = 0;
	let ch;
	ch = "assbdFbdpdPdpfPdAAdpeoseslsQQEcDDldiVVkadiedkdkLLnm";
	for (i = 0; i < dados.length; i++) {
		j++;
		l = (Asc(dados.substr(i, 1)) + (Asc(ch.substr(j, 1))));
		if (j == 50) {
			j = 1;
		}
		if (l > 255) {
			l -= 256;
		}
		mensx += (Chr(l));
	}

	return mensx;

}
function descripta(dados) {
	let mensx = "";
	let l;
	let i;
	let j = 0;
	let ch;
	ch = "assbdFbdpdPdpfPdAAdpeoseslsQQEcDDldiVVkadiedkdkLLnm";
	for (i = 0; i < dados.length; i++) {
		j++;
		l = (Asc(dados.substr(i, 1)) - (Asc(ch.substr(j, 1))));
		if (j == 50) {
			j = 1;
		}
		if (l < 0) {
			l += 256;
		}
		mensx += (Chr(l));
	}

	return mensx;

}
function Asc(String) {

	return String.charCodeAt(0);

}
function Chr(AsciiNum) {

	return String.fromCharCode(AsciiNum)

}

function sleep(mls) {
	return new Promise((resolve, reject) => setTimeout(resolve, mls));
}

function buscaEntradas(mes, ano) {
	rootRef.child(`registros/${usuario.id}/${ano}/${mes}`).on("value", snapshot => {

		escondeLoading();
		excluiTabela();
		//ADICIONA UMA LINHA NA TABELA COM AS INFORMAÇOES DO NOVO REGISTRO
		snapshot.forEach(registro => {
			$("table tbody").append(criaLinhaEntradas(registro))
		});


	});
}
function criaLinhaEntradas(registro) {
	let tipo = "";
	let classeSpan = "";
	//DEFININDO SE O BOTÃO REFERENTE AO TIPO DO REGISTRO SERÁ VERDE OU VERMELHO
	if (registro.val().tipo == "entrada") {
		tipo = "btn btn-success"
		classeSpan = "fas fa-plus";
	} else {
		tipo = "btn btn-danger";
		classeSpan = "fas fa-minus";
	}

	const linha = `<tr id=${registro.key}>
					<td>${registro.val().descricao}</td>
					<td>${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(registro.val().valor)}</td>
					<td><button class='${tipo}'><span class='${classeSpan}'></span></button></td>
					<td><a href='cadastro.html?id=${registro.key}&ano=${registro.val().ano}&mes=${registro.val().mes}' class='btn btn-outline-primary text-uppercase font-weight-bold '><span class='fas fa-edit'></span></a></td>
					<td><button data-mes='${registro.val().mes}' data-ano='${registro.val().ano}' id='btn-excluir' value='${registro.key}' class='btn btn-outline-danger btn-excluir text-uppercase font-weight-bold '><span class='fas fa-trash'></span</button></td>
				</tr>`;
	return linha;
}


function excluiRegistro(ano, mes, id) {
	rootRef.child(`registros/${usuario.id}/${ano}/${mes}/${id}`).remove()
		.then(() => Notificacao.sucesso("Registro excluido com sucesso!"))
		.catch(erro => {
			console.log(erro);
			Notificacao.erro(erro);
		})
}




function confirmCallback(botao) {

	//SE BOTÃO-1 == 1, USUÁRIO CLICOU EM CONFIRMAR
	if (botao - 1 == 1) {

		//TODA VEZ QUE UM REGISTRO É EXCLUIDO DO BANCO ESSA FUNÇÃO O REMOVE DA TABELA
		rootRef.child(`registros/${usuario.id}/${auxAno}/${auxMes}`).on("child_removed", snapshot => {

			$("#" + auxId).fadeOut(function () {
				$(this).remove();
			});
		});

		excluiRegistro(auxAno, auxMes, auxId);
	}

}

function adicionaAnosNoSelect() {
	rootRef.child("anos").on("child_added", ano => {
		$("#select-ano").append(`<option value='${ano.key}'>${ano.key}</option>`);
	})
}