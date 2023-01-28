document.getElementById("but_submit").onclick = function getText() {
    var username = document.getElementById("txt_uname").value;
    var password = document.getElementById("txt_pwd").value;


    // console.log(username+"  "+password);

    if (username != "" && password != "") {
        $.ajax({
            url: 'http://127.0.0.1:8000/login/',
            type: 'post',
            data: {
                username: username,
                password: password
            },
            success: function (response) {
                alert(response.msg);
                if (response.status == 200) {
                    window.location.href = "http://127.0.0.1:5500/index.html";

                } 
                

            }
        });

        // FIREBASE API
    // fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA5meVmrsm-O5nWOqqH2YMo0D5Cbf_AuRY',
    // {
    //     method:'POST',
    //     body:JSON.stringify(
    //         {
    //             email:username,
    //             password:password,
    //             returnSecureToken: true
    //         }
    //     ),
    //     headers:{
    //         'Content-Type':'application/json'
    //     }
    // }).then(res=>{
    //     if(res.ok){
    //         // ...
    //         alert("Logged In Successfully.");
    //         window.location.href = "http://127.0.0.1:5500/index.html";
    //     }
    //     else{
    //         return res.json().then(data=>{
    //             let errorMsg = "Authentication Failed!";
    //             if(data && data.error && data.error.message)
    //                 errorMsg = data.error.message;
    //             alert(errorMsg);
    //         })
    //     }
    // })



    }
    else
        alert("Invalid Input !")
}

document.getElementById("but_signup").onclick = () => {
    window.location.href = "http://127.0.0.1:5500/web%20app/signup.html";
}