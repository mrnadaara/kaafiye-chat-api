import { MailtrapClient } from "mailtrap";
import { mailTrapApiKey } from "../config";

const setupMailTap = () => {
    if (!mailTrapApiKey) throw "No MailTrap API Key";
    return new MailtrapClient({
        token: mailTrapApiKey,
    });
};

export default setupMailTap();