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

$("#EditSenha").click(function(){
 const fb = firebase.database().ref();
 

cpwd = document.getElementById("cpwd").value

data = {cpwd}

fb.child("usuarios/senha").update(data);



});