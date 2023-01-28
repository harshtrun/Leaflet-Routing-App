check = () =>{
$.ajax({
    url: 'http://127.0.0.1:8000/login/',
    type: 'get',
    success: function (response) {
        if (response == 200) {
            alert("Successfully Logged In", response)

        } else {
            alert("Failed validation !! Err: "+ response)
        }
    }
});
}