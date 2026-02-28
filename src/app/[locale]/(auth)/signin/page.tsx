import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Image from 'next/image';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center flex flex-col items-center">
          {/* 2. Lógica del Logo Interactivo */}
          <div className="relative h-24 w-24 mb-2">
            {/* Se muestra en Modo Claro, se oculta en Oscuro */}
            <Image 
              src="/logos/todara-black.svg" 
              alt="Logo Todara" 
              fill
              className="object-contain dark:hidden"
              priority
            />
            {/* Se oculta en Modo Claro, se muestra en Oscuro */}
            <Image 
              src="/logos/todara-white.svg" 
              alt="Logo Todara" 
              fill
              className="object-contain hidden dark:block"
              priority
            />
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight">
            Bienvenido a Todara
          </CardTitle>
          <CardDescription>
            Inicia sesión para acceder a tu espacio de trabajo
          </CardDescription>
        </CardHeader>
        
        {/* ... (el resto del CardContent con los botones sigue exactamente igual) ... */}
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <form action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/es/dashboard/tasks" });
            }}>
              <Button variant="outline" className="w-full" type="submit">
                <FaGithub className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </form>
            
            <form action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/es/dashboard/tasks" });
            }}>
              <Button variant="outline" className="w-full" type="submit">
                <FaGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                O continúa con Magic Link
              </span>
            </div>
          </div>

          <form action={async (formData) => {
            "use server";
            await signIn("nodemailer", formData);
          }} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="leonardo@ejemplo.com" 
                required 
              />
            </div>
            <Button className="w-full" type="submit">
              Enviar enlace de acceso
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}