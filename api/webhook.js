export default async function handler(req, res) {
  console.log("Webhook acionado!");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const body = req.body;
  console.log("Corpo recebido:", body);

  // WHAPI envia mensagens assim:
  // { messages: [ { text: { body: "msg" }, from: "5531..." } ] }

  const msgObj = body?.messages?.[0];

  if (!msgObj) {
    console.log("Nenhuma mensagem válida encontrada.");
    return res.status(200).json({ message: "OK" });
  }

  const msgBody = msgObj?.text?.body || "";
  const from = msgObj?.from || "";

  console.log(`Mensagem recebida: "${msgBody}" de: ${from}`);

  // ---- Lógica da resposta ----
  let reply = "Olá! Recebemos sua mensagem.";

  if (msgBody.toLowerCase().includes("fatura")) {
    reply = "Sua solicitação foi registrada. Em breve enviarei o faturamento dos últimos 12 meses.";
  }

  if (msgBody.toLowerCase().includes("boleto")) {
    reply = "Ok! Vou gerar a segunda via do boleto.";
  }

  // ---- Enviar resposta via WHAPI ----
  const token = "TwxJ51jkF1ZF3A57Tbss0RPbCBJhADxj";

  try {
    const whapiResponse = await fetch(`https://gate.whapi.cloud/messages/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        to: from,
        body: reply
      })
    });

    const responseJson = await whapiResponse.json();
    console.log("Resposta WHAPI:", responseJson);

  } catch (error) {
    console.error("Erro ao enviar resposta WHAPI:", error);
  }

  return res.status(200).json({ success: true });
}
