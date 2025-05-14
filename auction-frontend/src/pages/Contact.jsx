import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';

const Contact = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, message }),
      });
      const data = await response.json();
      alert(data.message || 'Message sent successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending message.');
    }
  };

  return (
    <div className="contact-form">
      <h1>Contact Us</h1>
      <form id="contactForm" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} readOnly required />

        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Contact;
