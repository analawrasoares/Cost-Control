isLogged()
const usuario = getUserFromLS();
log(usuario);
$(document).ready(function(){
	
	$("#input-confirmar-senha").keyup(function(){

		//FUNCÃO VERIFICA SE O USER DIGITOU A SENHA CORRETA E VERIFICA TBM SE OS DOIS INPUTS DA SENHA NOVA ESTÃ0 IGUAIS
		isPasswordEqual();

	});

	$("#myForm").submit(e=>{
		e.preventDefault();
		
		//SE O USUARIO DIGITOU A SENHA ATUAL CORRETA E OS DOIS INPUTS DA SENHA NOVA CORRETA, ATUALIZA NO BANCO
		if(isPasswordEqual()){
			$("#btn-salvar-senha").append(" <span id='spinner' class='spinner-border spinner-border-sm'></span>");

<<<<<<< HEAD
=======
			usuario.senha = $("#input-confirmar-senha").val();
			localStorage.user = JSON.stringify(usuario);

			rootRef.child(`usuarios/${usuario.id}`).update({senha:usuario.senha})
			.then(()=>{
				
				Notificacao.sucesso("Senha atualizado com sucesso!");
				$("#spinner").remove();
			})
			.catch(erro=>{
				Notificacao.erro(erro);
				console.log(erro)
			});
		}  



	});

});


function isPasswordEqual(){
	const pwd = $("#input-nova-senha").val();
	const cpwd = $("#input-confirmar-senha").val();
		
	if(cpwd!=pwd){
		$("#message").html("*As duas senhas devem ser iguais*");
		$("#message").css("color","red");
			
		return false;
	}else{
		$("#message").html("");
		$("#EditSenha").removeAttr("disabled");
	}

	if(usuario.senha!=$("#input-senha-atual").val()){
		$("#message").html("*Senha atual estar errada*");
		$("#message").css("color","red");
			
		return false;
	}else{
		return true;
	}

}
>>>>>>> a46dbf31162735784afb07c4d6f2d9688c6a083c
