isLogged()
$(document).ready(function(){
	
	$("#input-confirmar-senha").keyup(function(){

		//FUNCÃO VERIFICA SE O USER DIGITOU A SENHA CORRETA E VERIFICA TBM SE OS DOIS INPUTS DA SENHA NOVA ESTÃ0 IGUAIS
		isPasswordEqual();

	});

	$("#input-senha-atual").blur(function(){

		//FUNCÃO VERIFICA SE O USER DIGITOU A SENHA CORRETA E VERIFICA TBM SE OS DOIS INPUTS DA SENHA NOVA ESTÃ0 IGUAIS
		isPasswordEqual();

	});

	$("#input-senha-atual").focus(function(){

		//FUNCÃO VERIFICA SE O USER DIGITOU A SENHA CORRETA E VERIFICA TBM SE OS DOIS INPUTS DA SENHA NOVA ESTÃ0 IGUAIS
		isPasswordEqual();

	});

	$("#myForm").submit(e=>{
		e.preventDefault();
		
		//SE O USUARIO DIGITOU A SENHA ATUAL CORRETA E OS DOIS INPUTS DA SENHA NOVA CORRETA, ATUALIZA NO BANCO
		if(isPasswordEqual()){
			$("#btn-salvar-senha").append(" <span id='spinner' class='spinner-border spinner-border-sm'></span>");



			usuario.senha = encripta($("#input-confirmar-senha").val());
			localStorage.user = JSON.stringify(usuario);
			
			rootRef.child(`usuarios/${usuario.id}`).update({senha:usuario.senha})
			.then(()=>{
				
				Notificacao.sucesso("Senha atualizada com sucesso!");
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

	if(usuario.senha!=encripta($("#input-senha-atual").val())){
		$("#message").html("*Senha atual estar errada*");
		$("#message").css("color","red");
			
		return false;
	}else{
		return true;
		
	}

}
