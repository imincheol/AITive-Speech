$(function(){
    console.log("haha");

    var submitButton = $("#buttonSubmit");
    // console.log(submitButton);
    submitButton.click(function() {

        var clinet_id = $(".dev-info--clinet__id").val();
        var client_secret = $(".dev-info--client_secret").val();
        var text = $(".text").val();
        var language = $(":input:radio[name=language]:checked").val();
        
        var params = {
            "client_id": clinet_id,
            "client_secret": client_secret,
            "text": text,
            "language": language,
        };
        console.log("parmas : ", params);

        $.ajax({
            type: "POST",
            url: "/tts",
            data: params,
            success: function(args) {
                console.log(args);
                if ( args.result == "success" ) {
                    var fileUrl = args.data.url;
                    window.location.assign(fileUrl);
                }
            },
            error: function(e) {
                console.log(e.responseText);
            }
        });
    });
});