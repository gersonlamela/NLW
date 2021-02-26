import nodemailer, { Transporter } from "nodemailer"
import { resolve } from "path";
import handlebars from "handlebars";
import fs from "fs";
import { ObjectType } from "typeorm";

class SendMailService {
    private client: Transporter;
    constructor() {
        nodemailer.createTestAccount().then((account) => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure, // true for 465, false for other ports
                auth: {
                    user: account.user, // generated ethereal user
                    pass: account.pass, // generated ethereal password
                },
            });
            this.client = transporter;
        });
    }

    /**
     * const resposta = await execute()
     */

    async execute(to: string, subject: string, variables: object, path: string) {

        const templateFileContent = fs.readFileSync(path).toString("utf8");

        const mailTemplateParse = handlebars.compile(templateFileContent)

        const html = mailTemplateParse(variables);
        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreplay@nps.com.pt>",
        });
        console.log("Message sent: %s", message.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }
}
export default new SendMailService();