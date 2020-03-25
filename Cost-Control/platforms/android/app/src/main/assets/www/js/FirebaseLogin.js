firebase.auth().onAuthStateChanged(user=>{
	if(user){
	    
	    $("#btn-sair").removeAttr("hidden");

	    ref = firebase.database().ref("usuarios").child(user.uid);

	    ref.once("value").then(dados=>{
	        if(dados.val()==null){
	        
	        	console.log("usuario novo");
	        
	        }else{
	        	console.log("usuario já cadastrado");
	        }
	    });

	}else{
		console.log("Não logado");
	    $("#btn-sair").attr("hidden","hidden");
	    location.replace("../www/index.html");
	}
});

