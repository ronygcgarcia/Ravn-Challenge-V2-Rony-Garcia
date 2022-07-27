import bull from '../bull';
import sendEmailProcess from '../processes/email.process';

bull.process(sendEmailProcess);

const sendEmailQueue = (data: any) => {
    bull.add(data);
}


export default sendEmailQueue;
