import Email from "../helpers/Email.js";

const signUpEmail = async (name, email, token) => {
    const emailer = new Email();

    const body = `
        <p>Hola ${name}, comprueba tu cuenta en Vet Clinic.</p>
        <p>
            Tu cuenta ya está lista, solo debes comprobarla en el siguiente enlace:
            <a href=${process.env.FRONTEND_URL}/confirmar-cuenta/${token}>
                Confirmar cuenta
            </a>
        </p>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje.</p>
    `;

    return await emailer.send(name, email, "Confirma tu cuenta en Vet Clinic", body);
}

export default signUpEmail;