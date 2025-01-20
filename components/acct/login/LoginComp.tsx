import { loginAction } from "@/store/login/login-slice";
import { alertAction } from "@/store/modal/alert-slice";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";

const LoginComp = () => {
  // const [emailInput, setEmailInput] = useState("test@email.com");
  // const [passwordInput, setPasswordInput] = useState("test123!!");
  const router = useRouter();

  const dispatch = useDispatch();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const emailChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const passwordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
  };

  // 비밀번호 입력 영역에서 Enter 키 누르면 자동 로그인 버튼 클릭로직
  const autoLoginHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      loginBtn();
    }
  };

  // 각 입력값에 대한 정합성 확인
  const validationCheck = () => {
    if (!emailInput) {
      dispatch(alertAction.openModal({ cont: "이메일이 입력되지 않았습니다" }));
      return false;
    }
    if (!passwordInput) {
      dispatch(
        alertAction.openModal({ cont: "비밀번호가 입력되지 않았습니다" }),
      );
      return false;
    }
    return true;
  };

  // 회원가입 버튼 클릭 -> 회원가입 로직 실행
  const loginBtn = async () => {
    if (validationCheck()) {
      const data = {
        email: emailInput,
        password: passwordInput,
      };
      try {
        const response = await axios.post("/api/acct/login", data, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (response.data.code === 200) {
          const loginData = response.data.data;
          dispatch(
            loginAction.login({
              userEmail: emailInput,
              userName: loginData.userName,
              accessToken: loginData.accessToken,
              refreshToken: loginData.refreshToken,
            })
          );
          dispatch(alertAction.openModal({ cont: response.data.message }));
          router.push("/");
        } else {
          dispatch(alertAction.openModal({ cont: response.data.message }));
        }
      } catch (error) {
        console.error('Login error:', error);
        dispatch(alertAction.openModal({ cont: "로그인 중 오류가 발생했습니다." }));
      }
    }
  };

  return (
    <>
      <div className="w-full h-auto overflow-hidden">
        <div className="absolute top-1/2	left-1/2	-mt-[200px] -ml-[250px] w-[500px] h-[400px] bg-white/75">
          <div className="absolute top-1/2	left-1/2	-mt-[150px] -ml-[170px]  flex w-[340px] h-[300px] flex-col justify-start items-center gap-5">
            <p className="text-[40px] text-left text-[#1e90ff]">로그인</p>
            <input
              type="text"
              placeholder="이메일을 입력해 주세요"
              value={emailInput}
              data-key="emailInput"
              onChange={emailChangeHandler}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={passwordInput}
              data-key="passwordInput"
              onChange={passwordChangeHandler}
              onKeyDown={autoLoginHandler}
            />
            <button className="h-11" onClick={loginBtn}>
              로그인
            </button>
            <p
              className="w-[340px] h-3.5 text-xs text-right text-black cursor-pointer"
              onClick={() => {
                router.push("/acct/signup");
              }}
            >
              회원가입
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginComp;
