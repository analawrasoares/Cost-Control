$(document).ready(function(){
    
$("#cpwd").keyup(function(){
    var pwd = $("#pwd").val();
    var cpwd = $("#cpwd").val();
    
    if(cpwd!=pwd){
        $("#message").html("*As duas senhas devem ser iguais*");
         $("#message").css("color","red");
        
        return false;
    }else{
        $("#message").html("");
        $("#EditSenha").removeAttr("disabled");
        return true;
    }
    });
});

