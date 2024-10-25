// const nodemailer = require('nodemailer');
// require('dotenv').config(); // Assurez-vous d'inclure dotenv pour accéder aux variables d'environnement

// const sendEmail = async (options) => {
//     // Configuration du transporteur pour utiliser Mailjet
//     let transporter = nodemailer.createTransport({
//         host: 'in-v3.mailjet.com', // Serveur SMTP de Mailjet
//         port: 587, // Port standard pour SMTP
//         auth: {
//             user: process.env.MAILJET_API_KEY, // Clé API publique de Mailjet
//             pass: process.env.MAILJET_API_SECRET, // Clé API secrète de Mailjet
//         }
//     });

//     // Configuration de l'email à envoyer
//     let mailOptions = {
//         from: process.env.MAILJET_EMAIL_SENDER, // Votre adresse e-mail vérifiée sur Mailjet
//         to: options.email, // Adresse e-mail du destinataire
//         subject: options.subject, // Sujet de l'email
//         text: options.message, // Corps de l'email en texte brut
//         // Pour envoyer du HTML, vous pouvez utiliser la propriété 'html' à la place de 'text'
//     };

//     // Envoi de l'email
//     try {
//         let info = await transporter.sendMail(mailOptions);
//         console.log('Message sent: %s', info.messageId);
//     } catch (error) {
//         console.error('Failed to send email:', error);
//     }
// };

// module.exports = sendEmail;
