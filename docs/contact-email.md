# Contact-form email setup

Messages are delivered to help@easternwestern.net using authenticated Hostinger SMTP. Visitor email addresses are used as Reply-To, so replies go to the visitor.

The server defaults to smtp.hostinger.com, port 465 with SSL/TLS, and the verified mailbox help@easternwestern.net. Add SMTP_PASSWORD to this website's Hostinger environment variables using the existing mailbox password. Keep its value private; do not put it in Git or frontend VITE_ variables. Add it through hPanel without replacing other environment variables.

Optional overrides: SMTP_HOST, SMTP_PORT (465 or 587), SMTP_USER, CONTACT_TO_EMAIL. Port 587 requires STARTTLS. SMTP_PASS is also accepted as a password alias.

After updating variables, let the application restart and reload the Contact page. The form shows Send message when SMTP is configured. A success message is returned only when the SMTP server accepts the recipient. A failed delivery keeps the visitor's form text and returns an error.

To verify, submit one clearly labelled test enquiry to the configured mailbox and confirm its receipt in Hostinger Email. No automatic response is sent to the visitor.

Hostinger settings: https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/
