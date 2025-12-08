export default async function handler(req, res) {
  try {
    // Permitir somente POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    console.log("Webhook acionado!");

    // Corpo recebido do Whapi
    const body = req.body;
    console.log("Corpo recebido:", body);

    // Verifica se existe mensagem
    const messages = body?.messages;
    if (!messages || messages.length === 0) {
      console.log("Nenhuma mensagem válida encontrada.");
      return res.status(200).json({ received: true });
    }

    // Dados da mensagem
    const msg = messages[0];
    const texto = msg?.text?.body || "";
    const sender = msg?.from || "";
    const nome = msg?.from_name || "";

    console.log(`Mensagem recebida: "${texto}" de: ${sender}`);

    // -----------------------------------------
    // RESPOSTA AUTOMÁTICA DE BOAS-VINDAS
    // -----------------------------------------

    const welcomeMessage =
      `Olá *${nome}*! 👋\n\n` +
      `Sou o assistente virtual da contabilidade. Como posso ajudar hoje?\n\n` +
      `Escolha uma opção:\n\n` +
      `1️⃣ Solicitações\n` +
      `2️⃣ Administração\n` +
      `0️⃣ Falar com um atendente`;

    // Enviar mensagem via Whapi
    await fetch("https://gate.whapi.cloud/messages/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHAPI_TOKEN}`
      },
      body: JSON.stringify({
        to: sender,
        body: welcomeMessage
      })
    })
      .then((r) => r.json())
      .then((data) => console.log("Resposta Whapi:", data))
      .catch((err) => console.error("Erro Whapi:", err));

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erro no webhook:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
