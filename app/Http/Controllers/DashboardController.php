<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $resources = build_resource_array('Halaman dashboard', breadcrumb: [
            [
                'link' => route('dashboard'),
                'name' => 'Dashboard',
                'active' => false
            ],
        ]);

        return view('dashboard', $resources);
    }
}
