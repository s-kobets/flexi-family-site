import type { Handler, HandlerEvent } from "@netlify/functions";

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

const escapeMarkdown = (text: string): string => {
  // Экранируем специальные символы в тексте сообщения
  return text.replace(/([_*[\]()~`>#+=\|{}.!-])/g, "\\$1");
};

const handler: Handler = async (event: HandlerEvent) => {
  try {
    if (!event.body) {
      return;
    }

    const { full_name, contact_channel, message } = JSON.parse(event.body);
    // Экранируем специальные символы в каждом поле сообщения
    const escapedFullName = escapeMarkdown(full_name);
    const escapedContactChannel = escapeMarkdown(contact_channel);
    const escapedMessage = escapeMarkdown(message);

    const telegramMessage = `
✨ *Новое сообщение с сайта* ✨
*Как зовут:* ${escapedFullName}
*Как связаться:* ${escapedContactChannel}
*Сообщение:*
${escapedMessage}
    `;

    // Формируем URL для отправки сообщения
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    // Опции запроса
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: "MarkdownV2", // Указываем использование Markdown
      }),
    };

    // Отправляем запрос к API Telegram
    const response = await fetch(apiUrl, requestOptions);
    console.log(response);

    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(
        `Telegram API request failed with status ${response.status}`,
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Message sent successfully",
      }),
    };
  } catch (error) {
    console.error("Error sending message to Telegram:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Failed to send message to Telegram",
      }),
    };
  }
};

export { handler };
