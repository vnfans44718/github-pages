import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestVerify, requestRegister } from "../api/authApi";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false); // 인증 여부
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 1️⃣ 인증번호 발송
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestVerify(email); // /auth/verify
      alert("인증번호가 이메일로 발송되었습니다!");
    } catch (err) {
      setError(err.response?.data?.error || "이메일 발송 실패");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ 인증번호 확인 (버튼 클릭 시)
  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (!code) return alert("인증번호를 입력해주세요!");
    setVerified(true);
    alert("인증번호 입력 완료! 이제 비밀번호를 설정하세요.");
  };

  // 3️⃣ 최종 회원가입
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!verified) return alert("이메일 인증을 먼저 완료해주세요!");

    setError("");
    setLoading(true);
    try {
      await requestRegister({ email, password, code }); // /auth/register
      alert("회원가입 완료! 로그인 해주세요.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>회원가입</h2>
      <form style={styles.form}>
        {/* 이메일 */}
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <button onClick={handleSendCode} disabled={loading} style={styles.button}>
          {loading ? "전송 중..." : "인증번호 받기"}
        </button>

        {/* 인증번호 */}
        <input
          type="text"
          placeholder="인증번호 입력"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          style={styles.input}
        />
        <button onClick={handleVerifyCode} disabled={loading} style={styles.button}>
          {loading ? "확인 중..." : "인증번호 확인"}
        </button>

        {/* 비밀번호 */}
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        {/* 최종 회원가입 */}
        <button
          onClick={handleRegister}
          disabled={!verified || loading}
          style={{
            ...styles.button,
            backgroundColor: verified ? "#4CAF50" : "#ccc",
          }}
        >
          {loading ? "가입 중..." : "회원가입 완료"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: { maxWidth: "400px", margin: "50px auto", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", fontSize: "16px" },
  button: { padding: "10px", fontSize: "16px", cursor: "pointer" },
  error: { color: "red", marginTop: "10px" },
};
