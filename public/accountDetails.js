$(document).ready(()=>{
    $.get('/accountDetails')
        .done((res)=>{
            $('#accountDetails').append(`<h4> Your account details </h4>`);
            $('#accountDetails').append(`<p> Email: ${res.email} </p>`);
        })
        .fail((res)=>{
            if(res.status === 404)
                $('#accountDetails').append(`<p> Error while loading your account details! </p>`);
            else if(res.status === 403)
                $('#accountDetails').append(`<p> Your account is not activated! Check your mail for activation link. </p>`);
        })
})