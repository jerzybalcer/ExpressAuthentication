$(document).ready(()=>{

    $('#register').submit((event)=>{
        event.preventDefault();
        
        if(inputErr) return;

        $.ajax({
            method: 'POST',
            url: '/register',
            data: {email: $(event.target).find('#email').val(), pass: $(event.target).find('#pass').val()}
        }).done((res)=>{

            $('.err').remove();
            if(res == 'error'){
                $('#register').append(`<p class='err'> There was an error while creating your account! </p>`);
            }else if(res == 'exists'){
                $('#register').append(`<p class='err'> That email adress is already in use! </p>`);
            }else if(res == 'created'){
                $('#register').append(`<p class='err'> Account created! Activate it by clicking on the link we sent to your email. </p>`);
            }
        })
    })

    
})
