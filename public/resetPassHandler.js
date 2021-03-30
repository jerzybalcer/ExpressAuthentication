$(document).ready(()=>{

    $('#resetPass').submit((event)=>{
        event.preventDefault();
        
        if(inputErr) return;

        $.ajax({
            method: 'POST',
            url: '/resetPass',
            data: {email: $(event.target).find('#email').val()}
        }).done((res)=>{
            
            $('.err').remove();
            
            $('#resetPass').append(`<p class='err'> Reset your password by clicking on the link we sent to your email. </p>`);
        })
    })

    
})
