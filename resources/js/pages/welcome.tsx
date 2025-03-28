import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="صفحه اصلی" />
            <header className="container mx-auto mb-2 w-full py-4 text-sm">
                <nav className="flex items-center gap-4">
                    {auth.user ? (
                        <Button asChild className="curosr-pointer" variant="secondary">
                            <Link method="post" href={route('logout')}>
                                خروج از حساب
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild className="curosr-pointer" variant="secondary">
                            <Link href={route('login')}>ورود به سایت</Link>
                        </Button>
                    )}
                </nav>
            </header>
            <div className="container mx-auto">سلام دنیا!</div>
        </>
    );
}
