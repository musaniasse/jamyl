import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
'../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Boxes, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
interface LoginProps {
  onLogin: () => void;
}
export function Login({ onLogin }: LoginProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !password) {
      toast.error(
        'Veuillez renseigner votre identifiant et votre mot de passe.'
      );
      return;
    }
    toast.success('Connexion réussie');
    onLogin();
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-sm md:max-w-md"
        initial={{
          opacity: 0,
          y: 16
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut'
        }}>
        
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Boxes className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-bold tracking-tight">StockPro</span>
        </div>

        <Card className="border-none shadow-none md:border md:shadow-sm">
          <CardHeader className="text-center px-4 md:px-6">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Accédez à votre espace de gestion de stock
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login">Identifiant</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="login"
                    value={login}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
                    placeholder="Votre identifiant"
                    className="pl-9 h-11 md:h-10 text-base md:text-sm"
                    autoComplete="username" />
                  
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="pl-9 h-11 md:h-10 text-base md:text-sm"
                    autoComplete="current-password" />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 md:h-10">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>);

}