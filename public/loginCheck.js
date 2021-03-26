$(document).ready(()=>{

    $('#login').submit((event)=>{

        if(!$('#email').val() || !$('#pass').val()) {

            event.preventDefault();
            showLoginError();
        } 
    })

    let query = window.location.search;
    
    if(query === '?invalid'){
        showLoginError();
    }

})

function showLoginError(){
    $('#inputErr').remove();
    $('#container').append(`<p id='inputErr'> Invalid email or password! </p>`);
}