import nodemailer from "nodemailer";

class Email {
    constructor() {
        if (Email.instance) {
            return Email.instance;
        }

        // const development = false;
        const hasAuth = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            requireTLS: true,
            auth: hasAuth 
              ? {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
                : undefined,
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