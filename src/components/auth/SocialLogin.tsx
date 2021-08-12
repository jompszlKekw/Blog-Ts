import React from "react";
import { useDispatch } from "react-redux";

import {
  FacebookLogin,
  FacebookLoginAuthResponse,
} from "react-facebook-login-lite";
import { GoogleLogin, GoogleLoginResponse } from "react-google-login-lite";

import { googleLogin, facebookLogin } from "../../redux/actions/authAction";

function SocialLogin() {
  const dispatch = useDispatch();

  const onGGSuccess = (googleUser: GoogleLoginResponse) => {
    const id_token = googleUser.getAuthResponse().id_token;
    dispatch(googleLogin(id_token));
  };

  const onFBSuccess = (response: FacebookLoginAuthResponse) => {
    const { accessToken, userID } = response.authResponse;
    console.log(response);
    dispatch(facebookLogin(accessToken, userID));
  };

  return (
    <>
      <div className="my-2">
        <GoogleLogin
          client_id="723091898307-rjbo16sof1r89652blrvqr6e4f9eprl8.apps.googleusercontent.com"
          cookiepolicy="single_host_origin"
          onSuccess={onGGSuccess}
        />
      </div>

      <div className="my-2">
        <FacebookLogin appId="528588991698145" onSuccess={onFBSuccess} />
      </div>
    </>
  );
}

export default SocialLogin;
