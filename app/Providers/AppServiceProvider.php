<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureInertiaHistory();
    }

    /**
     * Configures Inertia to encrypt its history state.
     */
    private function configureInertiaHistory(): void
    {
        Inertia::encryptHistory(true);
    }
}
