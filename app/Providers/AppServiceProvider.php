<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Blade Directive
        |--------------------------------------------------------------------------
        */
        Blade::directive('generate_tags', function ($expression) {
            return "<?php 
                echo generate_tags($expression);
            ?>";
        });
    }
}
