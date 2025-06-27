<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FormsController;
use App\Http\Controllers\FilesController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('guest.api')->group(function () {
    // Getting refresh for captcha
    Route::get('/captcha/refresh', [AuthController::class, 'refresh_captcha'])->name('captcha.refresh');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/users/{uuid}', [UserController::class, 'show'])->name('api.user.show');
    Route::post('/forms', [FormsController::class, 'store'])->name('api.form.store');

    // File Upload & Delete
    Route::post('/file/upload', [FilesController::class, 'upload'])->name('api.file.upload');
    Route::delete('/file/delete', [FilesController::class, 'delete'])->name('api.file.delete');
});
