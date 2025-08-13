// src/components/About.tsx
import React from 'react';
import { Users, BookOpen, Cross, Heart } from 'lucide-react'; // Ícones mantidos, mas pode ajustar se não forem mais usados nos 'achievements'

const About: React.FC = () => {
  // Seus 'achievements' (conquistas) foram removidos para simplificar, mas podem ser adicionados novamente se desejar.
  // A versão que eu tinha anteriormente estava mais focada no texto da bio e na foto.
  // Se quiser os achievements de volta, me avise!

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:space-x-12">
        {/* Seção da Imagem do Fundador */}
        <div className="md:w-1/3 mb-8 md:mb-0">
          <img
            src="/alexandre-gomes-costa.png" // **Certifique-se que esta imagem está na sua pasta public/**
            alt="Alexandre Gomes da Costa - Fundador Alvorecer Mentorias"
            className="rounded-full w-64 h-64 object-cover mx-auto shadow-lg border-4 border-white"
          />
        </div>

        {/* Seção de Texto Sobre o Fundador */}
        <div className="md:w-2/3 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sobre Alexandre Gomes da Costa
          </h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Alexandre Gomes da Costa é o fundador e visionário por trás da Alvorecer Mentorias,
            dedicado a guiar indivíduos em uma jornada de crescimento espiritual e pessoal
            à luz dos princípios bíblicos. Com uma trajetória marcada pela fé e pelo serviço,
            Alexandre tem impactado milhares de vidas através de suas mentorias, cursos e escritos.
          </p>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Sua formação teológica e sua vasta experiência ministerial o capacitam a abordar
            temas complexos com clareza e profundidade, tornando a Palavra de Deus acessível
            e aplicável ao cotidiano. Alexandre é autor de diversas obras que inspiram e desafiam
            seus leitores a viverem uma fé autêntica e transformadora.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Sua paixão é ver pessoas restauradas, líderes capacitados e famílias fortalecidas,
            cumprindo o propósito divino em todas as áreas da vida.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;