import { createTransport} from 'nodemailer'

const sendMail = async (email, subject, text) => {
    const transport = createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    await transport.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject,
        text
    })
};

export default sendMail;