import { Head, useForm, usePage } from '@inertiajs/react';
import * as React from 'react';

import AuthLayout from '@/layouts/auth-layout';

import { OtpLoginForm } from '@/components/form/auth/otp-login-form';
import { PasswordLoginForm } from '@/components/form/auth/password-login-form';
import { PhoneNumberForm } from '@/components/form/auth/phone-number-form';
import { RegisterForm } from '@/components/form/auth/register-form';

import { cn } from '@/lib/utils';
import { SharedData } from '@/types';

enum LoginStatus {
    INITIAL = '',
    LOGIN = 'login',
    REGISTER = 'register',
}

enum LoginType {
    OTP = 'otp',
    PASSWORD = 'password',
}

export interface PhoneNumberFormData {
    phone_number: string;
    [key: string]: string;
}

interface LoginFormProps {
    phone_number: string;
    loginType?: string;
}

interface LoginProps {
    message?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ loginType, phone_number }): React.ReactElement => {
    return loginType === LoginType.OTP ? <OtpLoginForm phone_number={phone_number} /> : <PasswordLoginForm phone_number={phone_number} />;
};

export default function Login({ message }: LoginProps): React.ReactElement {
    const { data, setData, post, processing, errors } = useForm<PhoneNumberFormData>('login_phone_number', {
        phone_number: '',
    });

    const {
        props: {
            ziggy: { query },
        },
    } = usePage<SharedData>();

    const submit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        post(route('login.check-if-exists'));
    };

    const currentStatus = (query?.status as LoginStatus) || LoginStatus.INITIAL;

    return (
        <AuthLayout title="ورود به حساب کاربری" description="برای ورود به حساب شماره‌ی همراه خود را وارد کنید">
            <Head title="Log in" />

            {currentStatus === LoginStatus.INITIAL && (
                <PhoneNumberForm onSubmit={submit} data={data} setData={setData} processing={processing} errors={errors} />
            )}

            {currentStatus === LoginStatus.LOGIN && <LoginForm phone_number={query.phone_number} loginType={query.type} />}

            {currentStatus === LoginStatus.REGISTER && <RegisterForm />}
        </AuthLayout>
    );
}
