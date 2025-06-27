<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUnauthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah user sudah login
        if ($request->user()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Resources ini hanya dapat diakses oleh pengunjung yang belum masuk kedalam aplikasi.'
            ], 403); // atau 409 Conflict
        }

        return $next($request);
    }
}
