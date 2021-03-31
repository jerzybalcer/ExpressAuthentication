var inputErr;
$(document).ready(()=>{

    $('.form').submit((event)=>{
        inputErr = false;

        if($(event.target).attr('id') == 'register'){ // check input information before registering
            if($(event.target).find('#pass').val() != $('#passConfirm').val()){ // check if entered passwords match
                inputErr = true;
                $('.err').remove();
                $('#register').append(`<p class='err'> Entered passwords don't match! </p>`);
            }else if($('#passConfirm').val().length<6 || $('#passConfirm').val().length>30){ // check if entered passwords have proper length
                inputErr = true;
                $('.err').remove();
                $('#register').append(`<p class='err'> Password has to be from 6 to 30 characters long!</p>`);
            }
        }

         // check if all fields are filled
         $(event.target).find(':input').each((index,element)=>{
            if(!$(element).val()){
                event.preventDefault();
                $('.err').remove();
                $('.form:visible').append(`<p class='err'> Enter your information in all fields above! </p>`);
                inputErr = true;
            }
        });
    })
    
    // show error on redirect
    if(window.location.search === '?invalid') $('.form:visible').append(`<p class='err'> Invalid email or password! </p>`);

})

