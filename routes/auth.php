<?php

use App\Http\Controllers\Auth\AuthenticationController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticationController::class, 'create'])
        ->name('login');

    Route::post('login/check-if-exists', [AuthenticationController::class, 'checkUser'])
        ->name('login.check-if-exists');

    Route::post('login', [AuthenticationController::class, 'authenticate'])
        ->name('login.store');
});

Route::post('logout', [AuthenticationController::class, 'destroy'])
    ->name('logout');
