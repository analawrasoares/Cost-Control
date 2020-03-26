        $(document).ready(function(){
            
$("#salvar").click(function(){
                   
                Email.send({
                Host: "smtp.gmail.com",
                Username : "costcontrolproject@gmail.com",
                Password : "trabalhodojean123",
                To : $("#input-email").val(),
                From : "costcontrolproject@gmail.com",
                Subject : "Senha",
                Body : "Sua senha é:" + Math.floor(Math.random() * 65536)  + 32768 
                }).then(
                     alert("mail sent successfully")
                    
                ).catch(erro =>console.log(erro));
});
           
        });
        
 