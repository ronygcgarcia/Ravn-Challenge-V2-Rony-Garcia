import { Job } from 'bull';
import Mailer from '../../app/services/Mailer';

const sendEmailProcess = async (job: Job) => {
    await Mailer.sendEmail(job.data);
}

export default sendEmailProcess;