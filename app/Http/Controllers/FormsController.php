<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FormsController extends Controller
{
    public function index()
    {
        $resources = build_resource_array(
            'Halaman form',
            breadcrumb: [
                [
                    'link' => null,
                    'name' => 'Form',
                    'active' => true
                ],
                [
                    'link' => route('form.index'),
                    'name' => 'Index',
                    'active' => false
                ],
            ],
            css: [
                [
                    'href' => 'forms.css',
                    'base_path' => asset('assets/applications/css')
                ]
            ]
        );

        return view('form', $resources);
    }
}
