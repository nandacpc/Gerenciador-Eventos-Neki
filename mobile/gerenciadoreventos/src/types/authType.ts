export type AuthContextProps = {
  token: string | null;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export type AuthProviderProps = {
  children: React.ReactNode;
};
