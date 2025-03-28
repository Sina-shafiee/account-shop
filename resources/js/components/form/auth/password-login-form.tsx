import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';

import { SharedData } from '@/types';

interface PasswordLoginForm {
    phone_number: string;
    password: string;
}

interface Props {
    phone_number: string;
}

export function PasswordLoginForm({ phone_number }: Props) {
    const { data, setData, post, processing, errors } = useForm<Required<PasswordLoginForm>>({
        phone_number,
        password: '',
    });

    const message = usePage<SharedData>().props.message as string;

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('login');
    };

    return (
        <form className="flex flex-col gap-2" onSubmit={submit}>
            <div className="grid gap-2">
                <div className="grid gap-2">
                    <Label htmlFor="password" className="mb-2">
                        رمز عبور
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        autoFocus
                        dir="ltr"
                        tabIndex={1}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.phone_number ?? message ?? ''} />
                </div>
                <Button type="submit" className="mt-2 w-full" tabIndex={2} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    ورود
                </Button>
                <div className="flex h-8 justify-center">
                    <Button variant="link" type="button" className="p-0 text-sm">
                        ورود با کد یکبار مصرف
                    </Button>
                </div>
            </div>
        </form>
    );
}
