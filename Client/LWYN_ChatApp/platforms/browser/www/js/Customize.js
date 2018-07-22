function postToLocahost() {
    $("#add_new_dialog").modal("show");
    $('#add_new_dialog .progress').hide();

    $.ajax({
        type: "POST",
        url: 'localhost:8989/api/session.json',
        headers: {
            'Authorization': 'Basic xxxxxxxxxxxxx',
            'X_CSRF_TOKEN': 'xxxxxxxxxxxxxxxxxxxx',
            'Content-Type': 'application/json'
        },
        data: {
            "enrollId": "jim",
            "enrollSecret": "6avZQLwcUe9b"
        },
        success: function() { $('#mcs_container').html('<h1>Login successfull</h1>'); },
        error: function() { $('#mcs_container').html('<h1>Login error</h1>'); },
        dataType: dataType
    });
}