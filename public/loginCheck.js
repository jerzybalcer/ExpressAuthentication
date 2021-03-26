$(document).ready(()=>{

    $('#login').submit((event)=>{

        if(!$('#email').val() || !$('#pass').val()) {

            event.preventDefault();
            $('#inputErr').remove();
            $('#container').append(`<p id='inputErr'> Invalid email or password! </p>`);
        } 
    })

})