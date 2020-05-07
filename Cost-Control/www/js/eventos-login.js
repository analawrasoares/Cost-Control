
	
	log(localStorage);
	
	$("#input-cpf").mask("000.000.000-00");

	$("#form-login").submit(async e=>{
		e.preventDefault();

		const cpf = $("#input-cpf").unmask().val();
		const senha = $("#input-senha").val();

		//ADICIONA LOADING NO BOTÃO DE ENVIAR
		$("#btn-entrar").append("<span id='spinner' class='spinner-border spinner-border-sm'></span>");
		
		//FAZ CONSULTA NO BANCO VERIFICANDO CPF DIGITADO 
		const user = await firebase.database().ref("usuarios").orderByChild("cpf").equalTo(cpf).once("child_added");

		//REMOVE O LOADING NO BOTÃO ENVIAR
		$("#spinner").remove();

		//SE USER FOR NULL, USUÁRIO NÃO ENCONTRADO
		if(!user.val()||user.val().senha!=senha){
			Notificacao.erro("CPF ou senha errados!");
			return false;
		}

		logIn(user.val());
		


	});




});