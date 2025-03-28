import { AppLogoIcon } from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="md:bg-muted flex min-h-dvh flex-col items-center justify-center gap-2 sm:p-6 md:p-10">
            <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                <div className="flex h-9 w-9 items-center justify-center">
                    <AppLogoIcon className="size-9 fill-current" />
                </div>
            </Link>
            <div className="flex w-full max-w-md flex-col gap-2 sm:mt-4">
                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl border-none py-4 md:border md:py-6">
                        <CardHeader className="px-10 pb-0 text-center md:pt-8">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 pt-8 pb-2">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
