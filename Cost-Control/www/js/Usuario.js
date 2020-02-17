class Usuario{

	getNome(){
		return this.nome;
	}

	getFoto(){
		return this.foto;
	}

	getEmail(){
		return this.email;
	}

	getNumero(){
		return this.numero;
	}

	getUsuarioId(){
		return this.usuarioId;
	}

	getUsuarioGostos(){
		return this.gostos;
	}

	setNome(nome){
		this.nome=nome;
	}

	setFoto(foto){
		this.foto=foto;
	}

	setEmail(email){
		this.email=email;
	}

	setNumero(numero){
		this.numero=numero;
	}

	setUsuarioId(id){
		this.usuarioId=id;
	}

	setUsuarioGostos(gostos){
		this.gostos=gostos;
	}

	
}

class UsuarioDAO{
	static async salvar(user){
		var ref = firebase.database().ref("usuarios/"+user.getUsuarioId());
		ref.set(user).then(()=>location.replace("../www/telaPrincipal.html"))
		.catch(erro=>Notificacao.erro(erro));
	}
}