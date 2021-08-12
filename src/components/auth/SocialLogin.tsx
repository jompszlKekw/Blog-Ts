import React from "react";
import { useDispatch } from "react-redux";
import { GoogleLogin, GoogleLoginResponse } from "react-google-login-lite";

import { googleLogin } from "../../redux/actions/authAction";

function SocialLogin() {
  const dispatch = useDispatch();

  const onSuccess = (googleUser: GoogleLoginResponse) => {
    const id_token = googleUser.getAuthResponse().id_token;
    dispatch(googleLogin(id_token));
  };

  return (
    <div className="my-2">
      <GoogleLogin
        client_id="723091898307-rjbo16sof1r89652blrvqr6e4f9eprl8.apps.googleusercontent.com"
        cookiepolicy="single_host_origin"
        onSuccess={onSuccess}
      />
    </div>
  );
}

export default SocialLogin;
