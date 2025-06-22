<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function show_signin()
    {
        return view('signin');
    }

    public function signin(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:254',
            'password' => ['required', 'string', Password::min(8)->max(15)->mixedCase()->numbers()->symbols()],
            'captcha' => 'required|string|captcha'
        ], [
            'captcha.required' => 'Captcha is required',
            'captcha.captcha' => 'Captcha is invalid'
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();
            return redirect()->intended('/dashboard')->with('flash-message', [
                'type' => 'success',
                'title' => 'Success',
                'message' => 'Anda telah berhasil masuk kedalam aplikasi MYFORMS'
            ]);
        }

        return redirect()->route('signin.show')->with('flash-message', [
            'type' => 'error',
            'title' => 'Error',
            'message' => 'Gagal untuk masuk kedalam aplikasi. Isikan ulang email dan password anda dengan benar.'
        ])->withInput();
    }

    public function show_signup()
    {
        return view('signup');
    }

    public function signup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|string|email|max:254|unique:users',
            'password' => ['required', 'string', 'confirmed', Password::min(8)->max(15)->mixedCase()->numbers()->symbols()],
            'password_confirmation' => 'required|string|min:8|max:15|same:password',
            'captcha' => 'required|string|captcha'
        ], [
            'captcha.required' => 'Captcha is required',
            'captcha.captcha' => 'Captcha is invalid'
        ]);

        $user = new User();
        $user->fill(
            [
                'name' => $request->name,
                'email' => $request->email,
                'role' => 'participant',
                'password' => Hash::make($request->password)
            ]
        );
        $user->save();

        // Check if creation was successful
        if ($user->wasRecentlyCreated) {
            return redirect()->route('signin.show')->with('flash-message', [
                'type' => 'success',
                'title' => 'Success',
                'message' => 'User created successfully'
            ]);
        }

        return redirect()->route('signup.show')->with('flash-message', [
            'type' => 'error',
            'title' => 'Error',
            'message' => 'Failed to create user'
        ]);
    }

    public function signout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('signin.show')->with('flash-message', [
            'type' => 'success',
            'title' => 'Success',
            'message' => 'Anda telah berhasil keluar dari aplikasi MYFORMS'
        ]);
    }
}
