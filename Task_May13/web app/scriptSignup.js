document.getElementById("but_submit").onclick = function getText() {
  var username = document.getElementById("txt_uname").value;
  var password = document.getElementById("txt_pwd").value;
  var reEnterPassword = document.getElementById("txt_repwd").value;

  // console.log(username+"  "+password + " "+ reEnterPassword);

  if (username != "" && password != "" && reEnterPassword != "") {
    //   LOCAL FASTAPI BACKEND

    $.ajax({
      url: "http://127.0.0.1:8000/signup/",
      type: "post",
      data: {
        username: username,
        password: password,
        reEnterPassword: reEnterPassword,
      },
      success: function (response) {
        alert(response.msg);
      },
    });


    // FIREBASE API
    // fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA5meVmrsm-O5nWOqqH2YMo0D5Cbf_AuRY',
    //     {
    //         method:'POST',
    //         body:JSON.stringify(
    //             {
    //                 email:username,
    //                 password:password,
    //                 returnSecureToken: true
    //             }
    //         ),
    //         headers:{
    //             'Content-Type':'application/json'
    //         }
    //     }).then(res=>{
    //         if(res.ok){
    //             // ...
    //             alert("Signed Up Successfully. Please Log In to continue.")
    //         }
    //         else{
    //             return res.json().then(data=>{
    //                 let errorMsg = "Authentication Failed!";
    //                 if(data && data.error && data.error.message)
    //                     errorMsg = data.error.message;
    //                 alert(errorMsg);
    //             })
    //         }
    //     })

  } 
  
  
  
  else alert("Invalid Input !");
};

document.getElementById("but_login").onclick = () => {
  window.location.href = "http://127.0.0.1:5500/web%20app/login.html";
};
