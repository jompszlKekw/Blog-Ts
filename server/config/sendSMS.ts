import { Twilio } from 'twilio';

const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;
const from = `${process.env.TWILIO_PHONE_NUMBER}`;
const serviceID = `${process.env.TWILIO_SERVICE_ID}`;

const client = new Twilio(accountSid, authToken);

export function sendSMS(to: string, body: string, text: string) {
  try {
    client.messages
      .create({
        body: `BlogTy ${text} - ${body}`,
        from,
        to,
      })
      .then((message) => console.log(message.sid));
  } catch (error) {}
}

client.messages
  .create({
    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    from: '+15017122661',
    to: '+15558675310',
  })
  .then((message) => console.log(message.sid));

export async function smsOTP(to: string, channel: string) {
  try {
    const data = await client.verify
      .services(serviceID)
      .verifications.create({ to, channel });
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function smsVerify(to: string, code: string) {
  try {
    const data = await client.verify
      .services(serviceID)
      .verificationChecks.create({ to, code });
    return data;
  } catch (err) {
    console.log(err);
  }
}
