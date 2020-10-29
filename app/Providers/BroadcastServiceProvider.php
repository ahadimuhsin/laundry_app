<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //ubah ini
        // Broadcast::routes();

        //menjadi ini,  supaya hanya bisa diakses oleh user yang sudah login
        Broadcast::routes(['middleware' => 'auth:api']);

        require base_path('routes/channels.php');
    }
}
