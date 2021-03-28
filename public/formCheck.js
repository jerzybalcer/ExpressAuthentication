var inputErr;
$(document).ready(()=>{

    $('.form').submit((event)=>{
        inputErr = false;
    
        $(event.target).find(':input').each((index,element)=>{
            if(!$(element).val()){
                event.preventDefault();
                $('.err').remove();
                $('.form:visible').append(`<p class='err'> Enter your information in all fields above! </p>`);
                inputErr = true;
            }
        });
    })
    
    if(window.location.search === '?invalid') $('.form:visible').append(`<p class='err'> Invalid email or password! </p>`);

})

