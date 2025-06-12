<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FormsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

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

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
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
