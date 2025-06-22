<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FormsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Routes for un-authenticated users
Route::middleware('guest')->group(function () {
	Route::redirect('/', '/signin');

	Route::get('/signin', [AuthController::class, 'show_signin'])->name('signin.show');
	Route::post('/signin', [AuthController::class, 'signin'])->name('signin');

	Route::get('/signup', [AuthController::class, 'show_signup'])->name('signup.show');
	Route::post('/signup', [AuthController::class, 'signup'])->name('signup');
});

// Routes for authenticated users
Route::middleware('auth')->group(function () {
	Route::get('/signout', [AuthController::class, 'signout'])->name('signout');

	Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

	Route::get('/users', [UserController::class, 'index'])->name('user.index');
	Route::post('/users', [UserController::class, 'store'])->name('user.store');
	Route::put('/users/{uuid}', [UserController::class, 'update'])->name('user.update');
	Route::delete('/users/{uuid}', [UserController::class, 'destroy'])->name('user.destroy');

	Route::get('/forms', [FormsController::class, 'index'])->name('form.index');
	Route::get('/forms/create', [FormsController::class, 'create'])->name('form.create');
	Route::post('/forms', [FormsController::class, 'store'])->name('form.store');
	Route::get('/forms/{uuid}', [FormsController::class, 'show'])->name('form.show');
	Route::put('/forms/{uuid}', [FormsController::class, 'update'])->name('form.update');
	Route::delete('/forms/{uuid}', [FormsController::class, 'destroy'])->name('form.destroy');
});
