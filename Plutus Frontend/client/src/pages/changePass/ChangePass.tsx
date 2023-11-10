/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import change from "./changePass.module.css";
import picture from "./images/logo.png";
import OtpInput from "react-otp-input";
import { useDispatch } from "react-redux";
import { emailVerification, otpVerification } from "../../redux/action"

function changePass() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [modal, setModal] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const dispatch = useDispatch() as unknown as any;
 

  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };


  const toggleModal = () => {
    setModal(!modal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
     try {
          dispatch(emailVerification(email))
          e.preventDefault()
          toggleModal();
          sendOTP();
          
     } catch (error) {
          console.error(error)
     }
  };

  const handleVerify = async (e: React.FormEvent) => {
    dispatch(otpVerification(otp))
    e.preventDefault()
  
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const sendOTP = () => {
    setMinutes(4);
    setSeconds(59);
  };
  const resendOTP = () => {
    setMinutes(4);
    setSeconds(59);
  };

  return (
    <>
      <div className={change.changePassword}>
        <div className={change.leftside}>
          <img src={picture}  alt=""/>
          <h5>Plutus is personal finance made simple.</h5>
          <p>All your accounts, cards, savings, and investments in one place</p>
        </div>
        <div className={change.rightSide}>
          <div className="mb-36 pr-10 text-blue-600 text-end">
            <h2 className="text-3xl font-bold">Plutus</h2>
            <p>Online Banking</p>
          </div>
          {!modal && (
            <div className={change.content}>
              <h2>Change Password</h2>
              <p>Enter you email address</p>
              <form action="" className={change.form}>
                <input
                  className={change.inputEmail}
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  required
                  onChange={handleInputChange}
                ></input>
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className={change.button}
                >
                  Submit
                </button>
              </form>
            </div>
          )}
          {modal && (
            <div className={change.content1}>
              <h2 className="text-3xl font-semibold my-2"> Verify your identity</h2>
              <p id="first" className="w-96 text-[13px] sm:w-10">
                We've just sent an email with your security code to the email
                ogo_b*********.com
              </p>
              <p className="text-[13px]">Please enter the code in other to continue</p>
              <form className="mt-12">
                <div className={change.otpinput}>
                  <OtpInput
                    onChange={setOtp}
                    numInputs={4}
                    value={otp}
                    renderInput={(props) => <input {...props} />}
                    containerStyle={change.otpStyle}
                  />
                </div>
                <div className={change.countdowntext}>
                  {seconds > 0 || minutes > 0 ? (
                    <p>
                      Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </p>
                  ) : (
                    <p>Didn't recieve code?</p>
                  )}
                </div>
                
                  <button onClick={handleVerify} className={change.button}
                  disabled={!otp}>
                    Verify
                  </button>
          

                <button
                  id="otp_resend"
                  disabled={seconds > 0 || minutes > 5}
                  style={{
                    color: seconds > 0 || minutes > 0 ? "#fff" : "#FF5630",
                  }}
                  onClick={resendOTP}
                  className={change.button}
                >
                  I didn't get the code
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default changePass;
