class Notificacao {

   static sucesso  (){
        $.notify({
            icon:"fas fa-check",
            title:"<strong>Sucesso!</strong>",
            message:"Dados salvos com sucesso!"
            },{
                type:"success",
                animate:{
                    enter:"animated fadeInDown",
                    exit:"animated fadeOutUp"
                },
                placement: {
                    align: "center"
                }
        });
    }

   static erro (erro){
        $.notify({
            icon:"fas fa-times",
            title:"<strong>Erro!</strong> "+erro,
            message:""
            },{
                type:"danger",
                animate:{
                        enter:"animated fadeInDown",
                        exit:"animated fadeOutUp"
                },
                placement: {
                        align: "center"
                }
        });

    


    }
}