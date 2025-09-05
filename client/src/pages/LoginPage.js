import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ email, password });
      const token = res.data.token;

      // 🔑 JWT 토큰 로컬 스토리지 저장
      localStorage.setItem("token", token);

      alert("로그인 성공!");
      navigate("/dashboard"); // 로그인 성공 후 대시보드 이동
    } catch (err) {
      setError(err.response?.data?.error || "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "로그인 중..." : "로그인"}
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
