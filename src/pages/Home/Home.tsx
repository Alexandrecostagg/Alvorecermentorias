import React from 'react';
import Hero from '../../sections/Hero';
import About from '../../sections/About';
import CoursesSection from '../../sections/CoursesSection';
import Mentoring from '../Mentoring/MentoringPage';
import BoxKitsSection from '../../sections/BoxKitsSection';
import Testimonials from '../../sections/Testimonials';
import Contact from '../../sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <CoursesSection />
      <Mentoring />
      <BoxKitsSection />
      <Testimonials />
      <Contact />
    </>
  );
}
