import { BUSINESS } from "../../config/business";
import "./Contact.css";

function Contact() {
  const whatsappNumber = BUSINESS.whatsappNumber;

  const whatsappMessage = encodeURIComponent(
    "Hi! I'd like to know more about Mann Zariya's collection."
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-container">
          <p className="section-eyebrow">GET IN TOUCH</p>

          <h1>
            Let's help you find
            <br />
            something you'll love.
          </h1>

          <p className="contact-description">
            Have a question about our collection, product availability,
            sizes, or pricing? We're happy to help you find the perfect
            piece.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-whatsapp-button"
          >
            Chat with us on WhatsApp
            <span>→</span>
          </a>
        </div>
      </section>

      <section className="contact-details">
        <div className="contact-container">
          <div className="contact-details-grid">

            <div className="contact-detail">
              <p className="contact-label">WHATSAPP</p>

              <p className="contact-value">
                Get in touch directly for product enquiries and availability.
              </p>
            </div>

            <div className="contact-detail">
              <p className="contact-label">OUR COLLECTION</p>

              <p className="contact-value">
                Kurta Sets, Churidars & Salwars
              </p>
            </div>

            <div className="contact-detail">
              <p className="contact-label">FOLLOW US</p>

              <p className="contact-value">
                Discover our latest styles and updates on social media.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;