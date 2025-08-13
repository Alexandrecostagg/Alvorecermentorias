// src/components/Contact.tsx
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos prontos para te ajudar em sua jornada de fé e conhecimento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Informações de Contato - E-mail */}
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Mail className="h-12 w-12 text-red-700 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">E-mail</h3>
            <p className="text-gray-600">alexandrecostagg@gmail.com</p>
            <a href="mailto:alexandrecostagg@gmail.com" className="text-red-600 hover:underline mt-2 inline-block">Enviar E-mail</a>
          </div>

          {/* Informações de Contato - Telefone */}
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Phone className="h-12 w-12 text-red-700 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Telefone</h3>
            <p className="text-gray-600">+55 62 98579-3436</p>
            <a href="tel:+5562985793436" className="text-red-600 hover:underline mt-2 inline-block">Ligar Agora</a>
          </div>

          {/* Informações de Contato - Endereço */}
          <div className="bg-white p-8 rounded-lg shadow-md text-center lg:col-span-1 md:col-span-2"> {/* Ajuste para ocupar 1 ou 2 colunas dependendo do md */}
            <MapPin className="h-12 w-12 text-red-700 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Endereço</h3>
            <p className="text-gray-600">Rua 09, nº 216, Centro</p>
            <p className="text-gray-600">Bonfinópolis - GO, CEP 75.185-000</p>
            {/* Link para o Google Maps - você pode ajustar o link exato se tiver um pin específico */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Rua+09,+216,+Centro,+Bonfinópolis+-+GO,+75185-000" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-red-600 hover:underline mt-2 inline-block"
            >
              Ver no Mapa
            </a>
          </div>
        </div>

        {/* Se você tiver um formulário de contato, ele pode ser adicionado aqui, por exemplo: */}
        {/*
        <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Envie-nos uma Mensagem</h3>
          <form className="max-w-lg mx-auto space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nome</label>
              <input type="text" id="name" name="name" className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Seu nome" />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-mail</label>
              <input type="email" id="email" name="email" className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="seuemail@exemplo.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Mensagem</label>
              <textarea id="message" name="message" rows={5} className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Sua mensagem"></textarea>
            </div>
            <button type="submit" className="bg-red-700 text-white px-8 py-3 rounded-lg hover:bg-red-800 transition-colors font-semibold w-full">
              Enviar Mensagem
            </button>
          </form>
        </div>
        */}
      </div>
    </section>
  );
};

export default Contact;