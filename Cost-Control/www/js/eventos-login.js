$(document).ready(async function(){
	
	
	$("#input-cpf").mask("000.000.000-00");
	$("#input-senha-cpf").mask("000.000.000-00");

	$("#form-login").submit(async e=>{
		e.preventDefault();

		const cpf = $("#input-cpf").unmask().val();
		const senha = $("#input-senha").val();

		//ADICIONA LOADING NO BOTÃO DE ENVIAR
		$("#btn-entrar").append("<span id='spinner' class='spinner-border spinner-border-sm'></span>");
		
		//FAZ CONSULTA NO BANCO VERIFICANDO CPF DIGITADO 
		let user = await rootRef.child("usuarios").orderByChild("cpf").equalTo(cpf).once("value");
		user.forEach(auxUser=>{
			user = auxUser;
		})
		log(user.val())

		//REMOVE O LOADING NO BOTÃO ENVIAR
		$("#spinner").remove();

		//SE USER FOR NULL, USUÁRIO NÃO ENCONTRADO
		if(!user.val()||user.val().senha!=senha){
			Notificacao.erro("CPF ou senha errados!");
			return false;
		}

		logIn(user.val());
		


	});

	$("#form-esqueci-senha").submit(async e=>{
		e.preventDefault();
		const cpf = $("#input-senha-cpf").unmask().val();
		const email = $("#input-email").val();

		//ADICIONA LOADING NO BOTÃO DE ENVIAR
		$("#btn-enviar").append(" <span id='spinner' class='spinner-border spinner-border-sm'></span>");

		let user = await rootRef.child("usuarios").orderByChild("cpf").equalTo(cpf).once("value");
		user.forEach(auxUser=>{
			user = auxUser;
		})

		//SE USER FOR NULL, USUÁRIO NÃO ENCONTRADO
		if(!user.val()||user.val().email!=email){
			Notificacao.erro("CPF ou email errados!");
			$("#spinner").remove();
			return false;
		}

		//OBJETO EMAIL COM AS INFORMAÇÕES PARA SEREM MANDADAS VIA EMAIL
        const objEmail={
                Host: "smtp.gmail.com",
                Username : "costcontrolproject@gmail.com",
                Password : "trabalhodojean123",
                To : email,
                From : "costcontrolproject@gmail.com",
                Subject : "Recuperação Da Senha",
                Body : "Sua senha é:" + user.val().senha 
            };

		Email.send(objEmail)
		.then(()=>{
			Notificacao.sucesso("Sua senha já foi enviada ao seu email! Caso não encontre, cheque sua caixa de spam.");
			$("#spinner").remove();
			$("#myModal").modal("toggle");
		})            

	})




});