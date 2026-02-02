import Image from "next/image";
import React from "react";
import Logo from "../../../app/assets/logo.jpeg";
const Footer = () => {
  return (
    <div>
      <footer className="footer sm:footer-horizontal p-10 bg-primary text-secondary">
        <aside>
          <Image src={Logo} alt="Logo" width={120} height={40} />
          <p>
            ACME Industries Ltd.
            <br />
            Providing reliable tech since 1992
          </p>
        </aside>
        <nav>
          <h6 className="footer-title text-accent">Services</h6>
          <a href="/tuition-jobs" className="link link-hover">Tuition Jobs</a>
          <a href="/tutors" className="link link-hover">Tutor</a>
          <a href="/tuition-tutors" className="link link-hover">Tuition Tutors</a>
          <a href="/tuition-institutes" className="link link-hover">Tuition Institutes</a>
        </nav>
        <nav>
          <h6 className="footer-title text-accent">Company</h6>
          <a href="/about" className="link link-hover">About us</a>
          <a href="contact" className="link link-hover">Contact</a>
          
        </nav>
        <nav>
          <h6 className="footer-title text-accent">Legal</h6>
          <a href="/terms" className="link link-hover">Terms of use</a>
          <a href="/privacy" className="link link-hover">Privacy policy</a>
          <a href="/cookie" className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
