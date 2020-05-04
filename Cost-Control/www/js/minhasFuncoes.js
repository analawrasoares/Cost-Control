const log = console.log;

function retornaMes(mes){
	if(mes==0){
		return "Janeiro";
	}
	if(mes==1){
		return "Fevereiro";
	}
	if(mes==2){
		return "Marco";
	}
	if(mes==3){
		return "Abril";
	}
	if(mes==4){
		return "Maio";
	}
	if(mes==5){
		return "Junho";
	}
	if(mes==6){
		return "Julho";
	}
	if(mes==7){
		return "Agosto";
	}
	if(mes==8){
		return "Setembro";
	}
	if(mes==9){
		return "Outubro";
	}
	if(mes==10){
		return "Novembro";
	}
	if(mes==11){
		return "Dezembro";
	}
}

function escondeLoading() {
	$("#img-loading").removeClass("d-block");
	$("#img-loading").addClass("d-none");
}

function excluiTabela() {
	$("#tabela-entradas tbody").empty();
}
function mostraLoading(){
	$("#img-loading").removeClass("d-none");
	$("#img-loading").addClass("d-block");
}


function logOut(){
	localStorage.clear();
	location.replace("login.html");
}

function logIn(user){
	const stringUser = JSON.stringify(user);

	localStorage.user=stringUser;
	location.replace("index.html");
}
function isLogged(){
	if(!localStorage.user){
		location.replace("login.html")
	};
}