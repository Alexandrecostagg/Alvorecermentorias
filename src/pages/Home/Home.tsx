// src/pages/Home/Home.tsx
import Hero from '../../sections/Hero';
import About from '../../sections/About';
import CoursesSection from '../../sections/CoursesSection';
import MentoringPage from '../Mentoring/MentoringPage';
import BoxKitsSection from '../../sections/BoxKitsSection';
import Testimonials from '../../sections/Testimonials';
import Contact from '../../sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <CoursesSection />
      <MentoringPage />
      <BoxKitsSection />
      <Testimonials />
      <Contact />
    </>
  );
}
