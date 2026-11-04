import { useEffect, useRef, useState } from "react";

export default function ContactForm({ recipient = "help@easternwestern.net" }) {
  const [available, setAvailable] = useState(null);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const busy = useRef(false);

  useEffect(() => {
    let active = true;
    fetch("/api/contact/status", { cache: "no-store" })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("Unavailable")))
      .then(payload => { if (active) setAvailable(payload.available === true); })
      .catch(() => { if (active) setAvailable(false); });
    return () => { active = false; };
  }, []);

  const submit = async event => {
    event.preventDefault();
    if (busy.current || !available) return;
    busy.current = true;
    setSending(true);
    setFeedback(null);
    const form = event.currentTarget;
    const fields = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(["firstName", "lastName", "email", "phone", "subject", "message", "website"].map(key => [key, fields.get(key) || ""]))),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Your message could not be sent. Please try again.");
      setFeedback({ error: false, text: payload.message || "Your message has been sent." });
      form.reset();
    } catch (error) {
      setFeedback({ error: true, text: error.message || "Your message could not be sent. Please try again." });
    } finally {
      busy.current = false;
      setSending(false);
    }
  };

  return <form className="contact-form" onSubmit={submit} aria-busy={sending}>
    <label>First name<input name="firstName" required maxLength={80} autoComplete="given-name" placeholder="First name" /></label>
    <label>Last name<input name="lastName" maxLength={80} autoComplete="family-name" placeholder="Last name" /></label>
    <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" /></label>
    <label>Mobile number<input name="phone" type="tel" maxLength={32} autoComplete="tel" placeholder="03XX XXXXXXX" /></label>
    <label className="wide">Subject<input name="subject" required maxLength={160} placeholder="Article code or order number" /></label>
    <label className="wide">Message<textarea name="message" required minLength={10} maxLength={5000} placeholder="Tell us which article or order you need help with" /></label>
    <label className="contact-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <p className="wide contact-form-note">{available === false ? "The contact form is temporarily unavailable. " : "Send your enquiry directly to our team. "}<a href={"mailto:" + recipient}>Email us at {recipient}</a></p>
    {feedback && <p className={"wide contact-feedback " + (feedback.error ? "is-error" : "is-success")} role={feedback.error ? "alert" : "status"}>{feedback.text}</p>}
    <button className="wide" type="submit" disabled={sending || available !== true}>{sending ? "Sending…" : available === null ? "Loading form…" : "Send message"}</button>
  </form>;
}
