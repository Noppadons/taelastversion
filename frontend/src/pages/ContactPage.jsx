// frontend/src/pages/ContactPage.jsx (ฉบับแปลงโฉม)

import React from 'react';
import { FaEnvelope, FaTwitter, FaDiscord, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  
  const contactInfo = [
    {
      icon: <FaEnvelope className="text-accent" size={24} />,
      title: 'General Inquiries',
      detail: 'contact@tae-esport.com',
      href: 'mailto:contact@tae-esport.com'
    },
    {
      icon: <FaTwitter className="text-accent" size={24} />,
      title: 'Follow us on Twitter',
      detail: '@TAEesport',
      href: 'https://twitter.com'
    },
    {
      icon: <FaDiscord className="text-accent" size={24} />,
      title: 'Join our Discord',
      detail: 'discord.gg/tae-esport',
      href: 'https://discord.gg/TYJa5Bmf'
    },
    {
      icon: <FaMapMarkerAlt className="text-accent" size={24} />,
      title: 'Our Headquarters',
      detail: 'Bangkok, Thailand',
      href: '#'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // ในโปรเจคจริง เราจะเพิ่ม logic การส่งข้อมูลฟอร์มไปยัง backend ที่นี่
    alert("Thank you for your message! (This is a demo form)");
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Page Header */}
      <section className="bg-surface py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main">ติดต่อเรา</h1>
          <p className="text-lg text-text-secondary mt-2">เรายินดีรับฟังความคิดเห็นจากคุณ ไม่ว่าจะเป็นคำถาม ความร่วมมือ หรือข้อเสนอแนะ</p>
        </div>
      </section>

      <div className="container mx-auto p-8">
        <div className="max-w-6xl mx-auto bg-surface rounded-lg shadow-2xl grid grid-cols-1 md:grid-cols-2">
          {/* Left Side: Contact Info */}
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-text-main mb-6">ข้อมูลการติดต่อ</h2>
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                  <div className="bg-background p-3 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-secondary">{item.title}</h3>
                    <p className="text-lg text-text-main group-hover:text-accent transition-colors">{item.detail}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="p-8 md:p-12 bg-background rounded-r-lg">
            <h2 className="text-3xl font-bold text-text-main mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Your Name</label>
                <input type="text" id="name" name="name" required className="mt-1 block w-full input bg-surface border-gray-600 focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Your Email</label>
                <input type="email" id="email" name="email" required className="mt-1 block w-full input bg-surface border-gray-600 focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary">Message</label>
                <textarea id="message" name="message" rows="5" required className="mt-1 block w-full textarea bg-surface border-gray-600 focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full btn bg-accent text-white hover:opacity-90">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;