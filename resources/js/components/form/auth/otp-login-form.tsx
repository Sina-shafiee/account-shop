// First create a new component file at @/components/form/otp-login-form.tsx

import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { InputError } from '@/components/ui/input-error';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

type OtpLoginFormProps = {
    phone_number: string;
};

type OtpFormData = {
    phone_number: string;
    otp: string;
};

export function OtpLoginForm({ phone_number }: OtpLoginFormProps) {
    const { data, setData, post, processing, errors } = useForm<OtpFormData>('login_otp', {
        phone_number,
        otp: '',
    });

    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (countdown > 0 && !canResend) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, canResend]);

    const resendOtp = () => {
        post(route('login.send-otp'), {
            onSuccess: () => {
                setCountdown(60);
                setCanResend(false);
            },
        });
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('login.verify-otp'));
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={submit}>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="otp">کد تایید</Label>
                    <InputOTP value={data.otp} onChange={(value) => setData('otp', value)} maxLength={6}>
                        <InputOTPGroup dir="ltr" className="w-full">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <InputError message={errors.otp} />
                </div>
                <Button type="submit" className="mt-2 w-full" tabIndex={2} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    ورود
                </Button>
                <div>
                    <Button
                        type="button"
                        variant="link"
                        className="cursor-pointer p-0 text-sm"
                        onClick={resendOtp}
                        disabled={!canResend || processing}
                    >
                        {!canResend ? `ارسال مجدد کد (${countdown})` : 'ارسال مجدد کد'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
