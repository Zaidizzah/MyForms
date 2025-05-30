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
            ],
            javascript: [
                [
                    'src' => 'forms.js',
                    'base_path' => asset('assets/applications/js')
                ]
            ]
        );

        return view('form', $resources);
    }

    public function create()
    {
        $resources = build_resource_array(
            'Halaman tambah form',
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
                [
                    'link' => route('form.create'),
                    'name' => 'Create',
                    'active' => false
                ],
            ],
            css: [
                [
                    'href' => 'add-forms.css',
                    'base_path' => asset('assets/applications/css')
                ]
            ],
            javascript: [
                [
                    'src' => 'questionManager.js',
                    'base_path' => asset('assets/js')
                ],
                [
                    'src' => 'fileUploadManager.js',
                    'base_path' => asset('assets/js')
                ],
                [
                    'src' => 'formBuilder.js',
                    'base_path' => asset('assets/js')
                ],
                [
                    'src' => 'add-forms.js',
                    'base_path' => asset('assets/applications/js')
                ]
            ]
        );

        return view('add-form', $resources);
    }

    public function store(Request $request)
    {
        //
    }

    public function show($uuid)
    {
        //
    }
}
