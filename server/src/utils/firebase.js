import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBJVSzjK5zUce_LgDiOBHmnN8hMw2XyyNM",
  authDomain: "ems-app-9b093.firebaseapp.com",
  projectId: "ems-app-9b093",
  storageBucket: "ems-app-9b093.firebasestorage.app",
  messagingSenderId: "234028164910",
  appId: "1:234028164910:web:2c47e45394eabe21f33cbf"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app