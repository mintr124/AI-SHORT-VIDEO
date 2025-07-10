import "./Register.css";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { clientId } from "../data/constants";
import {
  puddingIcon,
  facebookIcon,
  instagramIcon,
  youtubeIcon,
  googleIcon,
} from "../assets/icons";

const LoginPage = () => {
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(clientId);
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    const user = {
      name: decoded.name,
      picture: decoded.picture,
    };

    setUserInfo(user);
    setShowLoginBox(false);

    navigate("/homepage", { state: { user } });
  };

  const handleLoginError = () => {
    console.log("Google login failed");
  };

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/youtube.upload",
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const userData = await res.json();
      setUserInfo(userData);
      navigate("/homepage", {
        state: {
          accessToken: accessToken,
          user: {
            name: userData.name,
            picture: userData.picture,
          },
        },
      });
    },
    onError: () => console.log("Login Failed"),
  });

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-container">
        <video autoPlay muted loop playsInline className="background-video">
          <source src="/background.mp4" type="video/mp4" />
        </video>

        <nav className="navbar">
          <div className="logo">
            <div className="logo-img">
              <img
                src={puddingIcon}
                alt="Pudding..."
                style={{ width: "40px" }}
              />
            </div>
            <div className="logo-text">min.ai</div>
          </div>

          <div className="feature">
            <a className="a-active">Trang chủ</a>
            <a>Blog</a>
            <a>Về chúng tôi</a>
            <a>Hỗ trợ</a>
          </div>

          <div className="login-registry">
            {!userInfo ? (
              <>
                <div className="login" onClick={() => setShowLoginBox(true)}>
                  Đăng nhập
                </div>
                <button className="registry">Đăng ký</button>
              </>
            ) : (
              <div className="user-profile">
                <img src={userInfo.picture} alt="avatar" className="avatar" />
                <span className="username">{userInfo.name}</span>
              </div>
            )}
          </div>
        </nav>

        <div className="content">
          <div className="slogan">
            Trình Tạo Hình Ảnh và Video AI Tốt Nhất Cho Bạn!
          </div>
          <div className="description">
            Chỉ với vài dòng lệnh miêu tả và những thao tác đơn giản nhất, chúng
            tôi sẽ xuất bản cho bạn những hình ảnh và video phù hợp nhất với yêu
            cầu mà bạn đưa ra xử lý hoàn toàn bởi trí tuệ nhân tạo.
          </div>
          <button className="generate-btn">Tạo Video ngay</button>
        </div>

        <div className="about">
          <div>Liên hệ với chúng tôi</div>
          <div className="logo-about">
            <img className="icon" src={facebookIcon} alt="Facebook" />
            <img className="icon-1" src={instagramIcon} alt="Instagram" />
            <img className="icon" src={youtubeIcon} alt="Youtube" />
          </div>
          <div className="phone-email">0344448590 ~ minai@gmail.com</div>
          <div className="address">K22, Khóa CNTT, ĐH KHTN, ĐHQG TP.HCM</div>
        </div>

        {showLoginBox && (
          <div className="overlay">
            <div className="register-box">
              <button
                className="close-btn"
                onClick={() => setShowLoginBox(false)}
              >
                ✕
              </button>
              <h2>Đăng nhập</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    className="custom-input"
                    autoComplete="username"
                  />
                </div>
                <div className="input-group">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="custom-input"
                    autoComplete="current-password"
                  />
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" defaultChecked />
                  <label>Đồng ý điều khoản</label>
                </div>
                <button type="submit" className="register-btn">
                  Sử dụng tài khoản min.ai
                </button>
                <div style={{ display: "flex" }}>
                  <button
                    type="button"
                    className="register-btn-gg"
                    onClick={() => login()}
                  >
                    <img src={googleIcon} className="image-icon" />
                    Đăng nhập với Google
                  </button>
                </div>
              </form>
              <p className="login-link">
                Chưa có tài khoản? <a href="#">Đăng ký</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
