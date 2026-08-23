import resend
from config import settings

resend.api_key = settings.resend_api_key

def send_email(to: str, subject: str, html: str) -> bool:
    if not settings.resend_api_key:
        print(f"Skipping email to {to}: RESEND_API_KEY not set.")
        return False
        
    try:
        response = resend.Emails.send({
            "from": settings.resend_from_email,
            "to": to,
            "subject": subject,
            "html": html
        })
        print(f"Email sent to {to}: {response}")
        return True
    except Exception as e:
        print(f"Failed to send email to {to}: {e}")
        return False
