import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

router.post('/send-confirmation', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'El email es requerido' });
        }

        // Configuración real para enviar correos (p. ej. Gmail, Outlook, etc.)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_PORT == 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: '"MotorR Shop" <no-reply@motorr.com>',
            to: email,
            subject: 'Confirmación de Pedido - MotorR',
            text: 'Se confirma que has hecho el pedido exitosamente.',
            html: '<p>Se confirma que has hecho el pedido exitosamente.</p>'
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email enviado exitosamente' });

    } catch (error) {
        console.error('Error enviando email:', error);
        res.status(500).json({ message: 'Error interno al enviar el correo' });
    }
});

export default router;
