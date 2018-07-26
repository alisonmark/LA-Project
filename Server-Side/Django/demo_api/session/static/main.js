$(document).ready(function() {

    // =======================START Fixed 403 Forbidden error when making an ajax Post request in Django framework ============================

    var csrftoken = $.cookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    };

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    // =======================END Fixed 403 Forbidden error when making an ajax Post request in Django framework ============================

    // var strInput = $("#abc").values
    $('.apireq').click(function() {
        $.ajax({
            url: "https://127.0.0.1:8989/api/login.json",
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                "username": "ABC",
                "application_id": 72332,
                "auth_key": "t56EOP9X3M47vWq",
            }),
            dataType: "json",
            success: function(data) {
                $('#first_name').text(data.application_id);
                $('#last_name').text(data.application_id);
                $('#age').text(data.application_id);
                $('#gender').text(data.application_id);
            }
        });
    });
});