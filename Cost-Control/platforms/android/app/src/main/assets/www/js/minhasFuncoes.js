const log = console.log;
const usuario = getUserFromLS();


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
	$("table tbody").empty();
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

	localStorage.user = JSON.stringify(user);
	const usuario = JSON.parse(localStorage.user);
	
	
	location.replace("index.html");
}

function isLogged(){
	if(!localStorage.user){
		location.replace("login.html")
	};
}

function getUserFromLS(){
	let user = {};
	if(localStorage.user){
		user = JSON.parse(localStorage.user);

	}
	return user;

	
}