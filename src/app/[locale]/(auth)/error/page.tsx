import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md shadow-lg text-center border-red-200 dark:border-red-900">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <span className="text-2xl">⚠️</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
            Error de Autenticación
          </CardTitle>
          <CardDescription>
            No pudimos verificar tu inicio de sesión.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Es posible que el enlace haya expirado o que el proveedor (Google/GitHub) haya rechazado la conexión.
          </p>
          <Link href="/es/signin">
            <Button className="w-full">Intentar de nuevo</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}