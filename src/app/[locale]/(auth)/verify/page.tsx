import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <span className="text-2xl">📧</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Revisa tu correo</CardTitle>
          <CardDescription>
            Te hemos enviado un enlace mágico de acceso (Magic Link).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Haz clic en el enlace del correo para iniciar sesión automáticamente. Si no lo ves, revisa tu carpeta de spam.
          </p>
          <Link href="/es/signin">
            <Button variant="outline" className="w-full">Volver al inicio de sesión</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}