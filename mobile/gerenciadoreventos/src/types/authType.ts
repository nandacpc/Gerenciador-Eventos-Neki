export type AuthContextProps = {
  user: string | null;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
};

export type AuthProviderProps = {
  children: React.ReactNode;
};
