const config = require('./config');

module.exports = {
    sendEmail: function(subject, content) {
        const helper = require('sendgrid').mail;

        const emailFrom = new helper.Email(config.EMAIL_FROM);
        const emailTo = new helper.Email(config.EMAIL_TO);
        const emailSubject = subject;
        const emailContent = new helper.Content('text/html', content);
        const mail = new helper.Mail(emailFrom, emailSubject, emailTo, emailContent);

        const sg = require('sendgrid')(config.SENGRID_API_KEY);

        const request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });

        sg.API(request, function(error, response) {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        });
    }
};
