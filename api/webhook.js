export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const payload = req.body?.data || {};
  const message = payload.body || "";
  const from = payload.from || "";

  console.log("Mensagem recebida:", message, "de:", from);

  let reply = "Olá! Recebemos sua mensagem.";

  if (message.toLowerCase().includes("faturamento")) {
    reply = "Solicitação registrada: Faturamento dos últimos 12 meses.";
  }

  if (message.toLowerCase().includes("boleto")) {
    reply = "Ok! Vamos gerar a segunda via do boleto.";
  }

  // Envia resposta via UltraMsg
  await fetch(
    `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: process.env.TOKEN,
        to: from,
        body: reply,
      }),
    }
  );

  return res.status(200).json({ success: true });
}
