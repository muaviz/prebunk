import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.digest_builder import build_weekly_digest
from services.email_service import send_email
import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", action="store_true", help="Send to a test email instead of all subscribers")
    parser.add_argument("--email", type=str, default="test@example.com", help="Email to send test digest to")
    args = parser.parse_args()

    print("Building weekly digest...")
    subject, html = build_weekly_digest()
    
    if not html:
        print("Failed to build digest (no narratives found?)")
        return

    if args.test:
        print(f"Sending test digest to {args.email}...")
        success = send_email(args.email, subject, html)
        if success:
            print("Digest sent successfully.")
        else:
            print("Failed to send digest.")
    else:
        print("Sending to all subscribers is not implemented in this script yet. Use the API endpoint.")

if __name__ == "__main__":
    main()
