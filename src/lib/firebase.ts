import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'studio-333112511-aaaaf',
  appId: '1:318028016230:web:2d8011026fee77bbc51ba7',
  apiKey: 'AIzaSyAr_AoHlyVI0owxya8C6qhih6CEaWyN0bg',
  authDomain: 'studio-333112511-aaaaf.firebaseapp.com',
  messagingSenderId: '318028016230',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
