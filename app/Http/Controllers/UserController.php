<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use App\Traits\ApiResponse;

class UserController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $resources = build_resource_array(
            'Halaman users',
            breadcrumb: [
                [
                    'link' => null,
                    'name' => 'Users',
                    'active' => true
                ],
                [
                    'link' => route('user.index'),
                    'name' => 'Index',
                    'active' => false
                ],
            ],
            css: [
                [
                    'href' => 'users.css',
                    'base_path' => asset('assets/applications/css')
                ]
            ],
            javascript: [
                [
                    'src' => 'users.js',
                    'base_path' => asset('assets/applications/js')
                ]
            ],
            additional: [
                'users' => User::where('deleted_at', null)->where('role', 'participant')->search($request->search)->paginate(25)->withQueryString()
            ]
        );

        return view('user', $resources);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|string|email|max:254|unique:users',
            'role' => 'required|string|in:participant',
            'password' => ['required', 'string', 'confirmed', Password::min(8)->max(15)->mixedCase()->numbers()->symbols()],
            'password_confirmation' => 'required|string|min:8|max:15|same:password'
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
            return redirect()->route('user.index')->with('flash-message', [
                'type' => 'success',
                'title' => 'Success',
                'message' => 'User created successfully'
            ]);
        }

        return redirect()->route('user.index')->with('flash-message', [
            'type' => 'error',
            'title' => 'Error',
            'message' => 'Failed to create user'
        ]);
    }

    public function show(Request $request, ?string $uuid = null)
    {
        if ($request->acceptsJson()) {
            $user = User::select('uuid', 'name', 'email', 'role', 'deleted_at')->where('deleted_at', null)->where('role', 'participant')->where('uuid', $uuid)->first();

            if ($user === NULL) {
                return $this->notFoundResponse('User data');
            }

            $CSRF_TOKEN = $request->header('X-CSRF-TOKEN'); // get value of X-CSRF-TOKEN from request header

            return $this->successResponse([
                'view' => view('user-edit', ['user' => $user, 'csrf' => $CSRF_TOKEN])->render()
            ], 'Formulir pengeditan data pengguna berhasil dibuat');
        }

        return $this->forbiddenResponse();
    }

    public function update(Request $request, ?string $uuid = null)
    {
        $user = User::where('deleted_at', null)->where('role', 'participant')->where('uuid', $uuid)->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:120',
            'email' => "required|string|email|max:254|unique:users,email,{$user->id}",
            'role' => 'required|string|in:participant',
        ]);

        $user->fill(
            [
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role
            ]
        );
        $user->save();

        if ($user->wasChanged()) {
            return redirect()->route('user.index')->with('flash-message', [
                'type' => 'success',
                'title' => 'Success',
                'message' => 'User updated successfully'
            ]);
        } else {
            return redirect()->route('user.index')->with('flash-message', [
                'type' => 'info',
                'title' => 'Info',
                'message' => 'No changes were made'
            ]);
        }

        return redirect()->route('user.index')->with('flash-message', [
            'type' => 'error',
            'title' => 'Error',
            'message' => 'Failed to update user'
        ]);
    }

    public function destroy(Request $request, ?string $uuid = null)
    {
        $user = User::where('deleted_at', null)->where('role', 'participant')->where('uuid', $uuid)->firstOrFail();

        $user->deleted_at = \Illuminate\Support\Carbon::now();
        $user->save();

        if ($user->wasChanged()) {
            return redirect()->route('user.index')->with('flash-message', [
                'type' => 'success',
                'title' => 'Success',
                'message' => 'User deleted successfully'
            ]);
        }

        return redirect()->route('user.index')->with('flash-message', [
            'type' => 'error',
            'title' => 'Error',
            'message' => 'Failed to delete user'
        ]);
    }
}
