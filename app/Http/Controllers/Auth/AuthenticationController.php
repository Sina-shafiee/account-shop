<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CheckUserRequest;
use App\Http\Requests\Auth\PasswordLoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticationController extends Controller
{
    /**
     * Number of attempts allowed before rate limiting kicks in
     */
    private const MAX_ATTEMPTS = 5;

    /**
     * Cooldown period in seconds for rate limiting
     */
    private const THROTTLE_SECONDS = 60;

    /**
     * Authentication guard name
     */
    private const AUTH_GUARD = 'web';

    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'message' => $request->session()->get('message'),
        ]);
    }

    /**
     * Check if a user exists with the given phone number.
     * Redirects to appropriate login or register flow.
     */
    public function checkUser(CheckUserRequest $request): RedirectResponse
    {
        $phoneNumber = $request->input('phone_number');
        $this->ensureWithinRateLimit($request, $phoneNumber, 'login-user-check');

        $user = User::where('phone_number', $phoneNumber)->first();
        $status = $user ? 'login' : 'register';

        return $this->redirectToLoginWithStatus($status, $phoneNumber);
    }

    /**
     * Authenticate user with phone number and password
     */
    public function authenticate(PasswordLoginRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $phoneNumber = $data['phone_number'];
        $remember = $request->boolean('remember', false);

        $key = $this->generateRateLimitKey($request, $phoneNumber, 'password-login');

        if (Auth::guard(self::AUTH_GUARD)->attempt($data, $remember)) {
            RateLimiter::clear($key);
            $request->session()->regenerate();

            Inertia::clearHistory();

            return redirect()->intended(route('home'));
        }

        $this->ensureWithinRateLimit($request, $phoneNumber, 'password-login');

        return $this->redirectToLoginWithStatus('login', $phoneNumber)
            ->with('message', __('auth.failed'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard(self::AUTH_GUARD)->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect(route('home'));
    }

    /**
     * Generate a route redirect with status and phone number.
     */
    protected function redirectToLoginWithStatus(string $status, string $phoneNumber): RedirectResponse
    {
        return redirect()->route('login', [
            'status' => $status,
            'phone_number' => $phoneNumber,
        ]);
    }

    /**
     * Generate a rate limit key based on method, phone number and IP address.
     */
    protected function generateRateLimitKey(Request $request, string $phoneNumber, string $method): string
    {
        return Str::transliterate(Str::lower("{$method}|{$phoneNumber}|{$request->ip()}"));
    }

    /**
     * Check and apply rate-limiting based on phone number and IP address.
     *
     * @throws ValidationException
     */
    protected function ensureWithinRateLimit(Request $request, string $phoneNumber, string $method): void
    {
        $key = $this->generateRateLimitKey($request, $phoneNumber, $method);

        if (RateLimiter::tooManyAttempts($key, self::MAX_ATTEMPTS)) {
            throw ValidationException::withMessages([
                'throttle' => __('auth.throttle', [
                    'seconds' => RateLimiter::availableIn($key),
                ]),
            ]);
        }

        RateLimiter::hit($key, self::THROTTLE_SECONDS);
    }
}
