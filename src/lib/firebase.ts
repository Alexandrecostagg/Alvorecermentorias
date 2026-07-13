import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const environmentConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(environmentConfig).every(Boolean)
  && !environmentConfig.apiKey?.includes('xxxx')
  && environmentConfig.projectId !== 'seu-projeto';

export const firebaseConfigurationMessage =
  'O Firebase não está configurado neste ambiente. Adicione as variáveis VITE_FIREBASE_* ao arquivo .env.local.';

// A configuração de demonstração evita uma falha de inicialização quando o
// repositório é aberto sem o .env.local. Nenhuma operação de autenticação ou
// banco é permitida enquanto as credenciais reais não estiverem presentes.
const firebaseConfig = isFirebaseConfigured
  ? environmentConfig
  : {
      apiKey: 'demo-api-key',
      authDomain: 'demo-alvorecermentorias.local',
      projectId: 'demo-alvorecermentorias',
      messagingSenderId: '000000000000',
      appId: '1:000000000000:web:demo',
    };

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
