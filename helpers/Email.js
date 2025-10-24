import nodemailer from "nodemailer";

class Email {
    constructor() {
        if (Email.instance) {
            return Email.instance;
        }

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async send(toName, toEmail, subject, body) {
        return await this.transporter.sendMail({
            to: {
                address: toEmail,
                name: toName
            },
            from: {
                address: process.env.EMAIL_SENDER,
                name: "Vet Clinic - Administrador de Pacientes de Veterinaria"
            },
            subject: subject,
            text: subject,
            html: body
        });
    }
}

export default Email;