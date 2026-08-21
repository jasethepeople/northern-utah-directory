type AlertInput = { subject: string; text: string };

export async function sendOwnerAlert({ subject, text }: AlertInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.OWNER_ALERT_EMAIL;
  if (!apiKey || !recipient) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Juris North Alerts <onboarding@resend.dev>",
      to: [recipient],
      subject,
      text,
    }),
  });
  if (!response.ok) {
    console.warn("[Email] Resend rejected owner alert", response.status);
    return false;
  }
  return true;
}
