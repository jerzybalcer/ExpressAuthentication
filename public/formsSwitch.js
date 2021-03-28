$(document).ready(()=>{

    $('.formSwitch').click(()=>{
        $('.err').remove();
    })

    $('#showRegister').click(()=>{
        $('.form').hide();
        $('#formsHeader').text('Sign up');
        $('#register').show();
    })

    $('#showResetPass').click(()=>{
        $('.form').hide();
        $('#formsHeader').text('Reset Password');
        $('#resetPass').show();
    })

    $('#showLogin').click(()=>{
        $('.form').hide();
        $('#formsHeader').text('Sign in');
        $('#login').show();
    })

})