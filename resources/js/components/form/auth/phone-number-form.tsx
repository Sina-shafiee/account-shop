import { usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';

import { PhoneNumberFormData } from '@/pages/auth/login';
import { SharedData } from '@/types';

interface PhoneNumberFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    data: {
        phone_number: string;
    };
    setData: (key: string, value: string) => void;
    processing: boolean;
    errors: Partial<Record<keyof PhoneNumberFormData, string>>;
}

export const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({ onSubmit, data, setData, processing, errors }): React.ReactElement => {
    const message = usePage<SharedData>().props.message as string;

    return (
        <form className="flex flex-col gap-2" onSubmit={onSubmit}>
            <div className="grid gap-2">
                <div className="grid gap-2">
                    <Label htmlFor="phone_number" className="mb-2">
                        شماره‌ی همراه
                    </Label>
                    <Input
                        id="phone_number"
                        type="tel"
                        required
                        autoFocus
                        dir="ltr"
                        tabIndex={1}
                        autoComplete="tel"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        placeholder="09123456789"
                    />
                    <InputError message={errors.phone_number ?? message ?? ''} />
                </div>
                <Button type="submit" className="mt-2 w-full cursor-pointer" tabIndex={2} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    ادامه
                </Button>
                <div className="h-8" />
            </div>
        </form>
    );
};
