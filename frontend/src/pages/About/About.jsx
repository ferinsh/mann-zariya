import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <main className="about-page">

      {/* HERO */}

      <section className="about-hero">
        <div className="about-container">
          <p className="section-eyebrow">ABOUT MANN ZARIYA</p>

          <h1>
            Clothing that feels
            <br />
            as beautiful as it looks.
          </h1>

          <p className="about-hero-description">
            Mann Zariya is about celebrating timeless style, thoughtful
            design, and pieces chosen to make everyday dressing feel a
            little more special.
          </p>
        </div>
      </section>

      {/* STORY */}

      <section className="about-story">
        <div className="about-container about-story-grid">

          <div className="about-story-heading">
            <p className="section-eyebrow">OUR STORY</p>

            <h2>
              Made for moments,
              <br />
              big and small.
            </h2>
          </div>

          <div className="about-story-content">
            <p>
              We believe clothing should feel effortless. It should bring
              together comfort, elegance, and a sense of confidence that
              stays with you throughout the day.
            </p>

            <p>
              Our collection focuses on kurta sets, churidars, and salwars
              selected with an appreciation for timeless silhouettes and
              versatile style.
            </p>

            <p>
              Whether you're dressing for an occasion or simply looking for
              something beautiful to wear every day, Mann Zariya is here to
              help you find a piece you'll love.
            </p>
          </div>

        </div>
      </section>

      {/* PHILOSOPHY */}

      <section className="about-philosophy">
        <div className="about-container">

          <p className="section-eyebrow">OUR PHILOSOPHY</p>

          <h2>
            Simple. Elegant.
            <br />
            Made to be worn.
          </h2>

          <p>
            We focus on pieces that feel timeless rather than temporary —
            clothing you can return to, style in your own way, and make part
            of your everyday life.
          </p>

        </div>
      </section>

      {/* CTA */}

      <section className="about-cta">
        <div className="about-container">

          <h2>
            Find something
            <br />
            you'll love.
          </h2>

          <Link to="/shop" className="about-cta-button">
            Explore the Collection
            <span>→</span>
          </Link>

        </div>
      </section>

    </main>
  );
}

export default About;