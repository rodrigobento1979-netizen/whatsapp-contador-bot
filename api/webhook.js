export default async function handler(req, res) {
  console.log("Webhook acionado!");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const data = req.body;
  console.log("Corpo recebido:", data);

  const message = data.body || "";      // <-- UltraMsg usa "body"
  const from = data.from || "";         // <-- UltraMsg usa "from"

  console.log("Mensagem recebida:", message, "de:", from);

  let reply = "Olá! Recebemos sua mensagem.";

  if (message.toLowerCase().includes("faturamento")) {
    reply = "Solicitação registrada: Faturamento dos últimos 12 meses.";
  }

  if (message.toLowerCase().includes("boleto")) {
    reply = "Ok! Vamos gerar a segunda via do boleto.";
  }

  console.log("Resposta que será enviada:", reply);

  try {
    const url = `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: process.env.TOKEN,
        to: from,
        body: reply
      }),
    });

    const result = await response.json();
    console.log("Resposta UltraMsg:", result);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }

  return res.status(200).json({ success: true });
}
