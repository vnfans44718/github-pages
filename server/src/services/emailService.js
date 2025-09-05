const transporter = require("../config/mailConfig");

/**
 * 인증번호 메일 발송
 * @param {string} to - 수신자 이메일
 * @param {string} code - 인증번호
 */
async function sendVerificationEmail(to, code) {
  const mailOptions = {
    from: `"MyApp" <${process.env.SMTP_USER}>`,
    to,
    subject: "이메일 인증번호",
    html: `<p>인증번호는 <b>${code}</b> 입니다. 5분 안에 입력해주세요.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ 인증 메일 발송 완료: ${to}`);
  } catch (err) {
    console.error("❌ 이메일 발송 오류:", err);
    throw new Error("이메일 전송 실패");
  }
}

module.exports = { sendVerificationEmail };
