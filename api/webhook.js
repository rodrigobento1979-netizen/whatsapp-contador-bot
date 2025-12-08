// /api/webhook.js

export default async function handler(req, res) {
  console.log("Webhook acionado!");

  // WHAPI usa POST para enviar mensagens e eventos
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const body = req.body;
  console.log("Corpo recebido:", body);

  // Estrutura WHAPI → body.messages.post.body.text
  const messageEvent = body?.messages?.post?.[0];

  if (!messageEvent) {
    console.log("Nenhuma mensagem válida encontrada.");
    return res.status(200).json({ message: "OK" });
  }

  const msgBody = messageEvent?.body?.text || "";
  const from = messageEvent?.from || "";
  
  console.log(`Mensagem recebida: "${msgBody}" de: ${from}`);

  // ---------- Lógica das respostas ----------
  let reply = "Olá! Recebemos sua mensagem.";

  if (msgBody.toLowerCase().includes("fatura")) {
    reply = "Sua solicitação foi registrada. Enviarei o faturamento dos últimos 12 meses em breve.";
  }

  if (msgBody.toLowerCase().includes("boleto")) {
    reply = "Ok! Gerando a segunda via do boleto.";
  }

  // ------------- ENVIAR RESPOSTA VIA WHAPI ----------------
  const channel = "CATWMN-MCBTH";
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

    const wres = await whapiResponse.json();
    console.log("Resposta WHAPI:", wres);

  } catch (error) {
    console.error("Erro ao enviar mensagem WHAPI:", error);
  }

  return res.status(200).json({ success: true });
}
