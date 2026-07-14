import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, firebaseConfigurationMessage, isFirebaseConfigured } from '../lib/firebase';
import type { UserProfile } from '../types';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    registerWithEmail: (email: string, pass: string, name: string, cpf?: string, birthDate?: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    saveUserProfile: (uid: string, data: Partial<UserProfile>) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isFirebaseConfigured) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            try {
                if (currentUser) {
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data() as UserProfile);
                    } else {
                        setUserProfile(null);
                    }
                } else {
                    setUserProfile(null);
                }
            } catch (error) {
                console.error('Erro ao carregar o perfil do usuário', error);
                setUserProfile(null);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const saveUserProfile = async (uid: string, data: Partial<UserProfile>) => {
        if (!isFirebaseConfigured) throw new Error(firebaseConfigurationMessage);
        await setDoc(doc(db, 'users', uid), data, { merge: true });
        // Update local state optimized
        setUserProfile(prev => prev ? { ...prev, ...data } : data as UserProfile);
    }

    const signInWithGoogle = async () => {
        if (!isFirebaseConfigured) throw new Error(firebaseConfigurationMessage);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user doc exists, if not create it
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                const newProfile: UserProfile = {
                    uid: user.uid,
                    email: user.email || '',
                    name: user.displayName || 'Sem nome',
                    photoURL: user.photoURL || '',
                    addresses: [],
                    role: 'user',
                    createdAt: new Date()
                }
                await setDoc(docRef, newProfile);
                setUserProfile(newProfile);
            } else {
                setUserProfile(docSnap.data() as UserProfile);
            }

        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        if (!isFirebaseConfigured) throw new Error(firebaseConfigurationMessage);
        await signInWithEmailAndPassword(auth, email, pass);
        // Auth state listener will handle fetching profile
    }

    const registerWithEmail = async (email: string, pass: string, name: string, cpf?: string, birthDate?: string) => {
        if (!isFirebaseConfigured) throw new Error(firebaseConfigurationMessage);
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        const user = result.user;

        const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            name: name,
            cpf: cpf || '',
            birthDate: birthDate || '',
            addresses: [],
            role: 'user',
            createdAt: new Date()
        }

        await setDoc(doc(db, 'users', user.uid), newProfile);
        setUserProfile(newProfile);
    }

    const resetPassword = async (email: string) => {
        if (!isFirebaseConfigured) throw new Error(firebaseConfigurationMessage);
        auth.languageCode = 'pt-BR';
        await sendPasswordResetEmail(auth, email.trim());
    }

    const logout = async () => {
        if (!isFirebaseConfigured) {
            setUser(null);
            setUserProfile(null);
            return;
        }
        try {
            await firebaseSignOut(auth);
            setUserProfile(null);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, signInWithGoogle, loginWithEmail, registerWithEmail, resetPassword, saveUserProfile, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
