```bash
PROXY_EMAIL_TRANSPORT=ses PROXY_EMAIL_FROM=noreply@yourco.com PROXY_SES_ACCESSKEYID=xxxx PROXY_SES_SECRETACCESSKEY=yyyyy node ./t/email.js you@yourco.com
PROXY_EMAIL_TRANSPORT=smtp PROXY_EMAIL_FROM=noreply@yourco.com PROXY_SMTP_USER=adminuser PROXY_SMTP_PASS=adminpassword PROXY_SMTP_HOST=smtp.sendgrid.net node ./t/email.js you@yourco.com
```
