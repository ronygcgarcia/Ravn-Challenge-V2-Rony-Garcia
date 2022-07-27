import nodemailer from 'nodemailer';
import mjml2html from 'mjml';
import IMail from '../interfaces/IMail';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export default class Mailer {
    static async sendEmail(params: IMail): Promise<void> {
        const {
            email, header = [], subject, message, body = [], image = 'https://i.ibb.co/bX93g69/banner.jpg'
        } = params;
        const { html } = mjml2html({
            tagName: 'mjml',
            attributes: {},
            children: [
                {
                    tagName: 'mj-body',
                    attributes: {},
                    children: [
                        {
                            tagName: 'mj-section',
                            attributes: {},
                            children: [
                                {
                                    tagName: 'mj-column',
                                    attributes: {},
                                    children: [
                                        {
                                            tagName: 'mj-image',
                                            attributes: {
                                                src: image,
                                                width: '350px',
                                            },
                                        },
                                        ...header,
                                        {
                                            tagName: 'mj-spacer',
                                            attributes: {
                                                'css-class': 'primary',
                                            },
                                        },
                                        {
                                            tagName: 'mj-divider',
                                            attributes: {
                                                'border-width': '3px',
                                                'border-color': '#d58737',
                                            },
                                        },
                                        {
                                            tagName: 'mj-text',
                                            attributes: {
                                                align: 'center',
                                                'font-weight': 'bold',
                                                'font-size': '12px',
                                            },
                                            content: message,
                                        },
                                        ...body,
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        const mailConfig = {
            from: `${process.env.SISTEM_NAME} <${process.env.MAIL_USER}>`,
            to: email,
            subject,
            html,
        };

        await transporter.sendMail(mailConfig);
    }
}
