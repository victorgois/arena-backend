import WhatsApp from "whatsapp";

// Your test sender phone number
const wa = new WhatsApp(Number(process.env.WA_PHONE_NUMBER_ID));

// Enter the recipient phone number
const recipient_number = Number(process.env.RECIPIENT_NUMBER);

export async function sendMessage() {
  try {
    const sent_text_message = wa.messages.text(
      { body: "Hello world" },
      recipient_number
    );

    await sent_text_message.then((res) => {
      console.log(res.rawResponse());
    });
  } catch (e) {
    console.log(JSON.stringify(e));
  }
}
