import Email from "../helpers/Email.js";

const recoveryEmail = async (name, email, token) => {
    const emailer = new Email();

    const body = `
        <p>Hola ${name}, has solicitado una recuperación de contraseña en tu cuenta de Vet Clinic.</p>
        <p>
            Para proceder, solo debes hacer click en el siguiente enlace:
            <a href=${process.env.FRONTEND_URL}/recuperar-contraseña/${token}>
                Recuperar mi contraseña
            </a>
        </p>

        <p>Si tú no fuiste quien solicitó, puedes ignorar el mensaje.</p>
    `;

    return await emailer.send(name, email, "Recupera tu cuenta de Vet Clinic", body);
}

export default recoveryEmail;