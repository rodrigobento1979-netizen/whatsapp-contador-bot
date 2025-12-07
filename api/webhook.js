export default async function handler(req, res) {
  console.log("Webhook acionado!");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Corpo recebido:", req.body);

  const data = req.body;

  const message = data?.body || data?.message || "";
  const from = data?.from || "";
  console.log("Mensagem recebida:", message, "de:", from);

  if (!from) {
    console.log("Erro: campo FROM não encontrado.");
    return res.json({ success: false, error: "Missing 'from'" });
  }

  // RESPOSTA PADRÃO
  let reply = "Olá! Recebemos sua mensagem.";

  if (message.toLowerCase().includes("faturamento")) {
    reply = "Sua solicitação de faturamento foi registrada!";
  }

  if (message.toLowerCase().includes("boleto")) {
    reply = "Vamos gerar a segunda via do seu boleto!";
  }

  console.log("Resposta que será enviada:", reply);

  try {
    const ultraURL = `https://api.ultramsg.com/${process.env.INSTANCE_ID}/messages/chat`;

    console.log("Enviando para UltraMsg:", ultraURL);

    const ultra = await fetch(ultraURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: process.env.ULTRAMSG_TOKEN,
        to: from,
        body: reply,
      }),
    });

    const result = await ultra.json();
    console.log("Resposta UltraMsg:", result);

    return res.json({ success: true, sent: result });

  } catch (err) {
    console.error("ERRO AO ENVIAR PARA ULTRAMSG:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
