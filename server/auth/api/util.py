from django.core.mail import EmailMessage

def send_custom_email(to_email, subject, body, html=False):
    email = EmailMessage(
        subject=subject,
        body=body,
        to=[to_email]
    )
    if html:
        email.content_subtype = "html"  # send as HTML
    email.send()
