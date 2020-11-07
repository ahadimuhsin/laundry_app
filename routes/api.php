<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', 'Auth\LoginController@login');

Route::group(['middleware' => 'auth:api'], function(){
    Route::resource('outlets', 'API\OutletController')->except(['show']);

    //product
    Route::get('product/laundry-type', 'API\ProductController@getLaundryType');
    Route::post('product/laundry-type', 'API\ProductController@storeLaundryType');
    Route::resource('product', 'API\ProductController')->except(['create', 'show']);

    //couriers
    Route::post('couriers/{id}', 'API\UserController@update')->name('couriers.update');
    Route::resource('couriers', 'API\UserController')->except(['create', 'show', 'update']);

    //roles
    Route::get('roles', 'API\RolePermissionController@getAllRole')->name('roles');
    Route::get('permissions', 'API\RolePermissionController@getAllPermission')->name('permissions');
    Route::post('role-permission', 'API\RolePermissionController@getRolePermission')->name('role_permission');
    Route::post('set-role-permission', 'API\RolePermissionController@setRolePermission')->name('set_role_permission');
    Route::post('set-role-user', 'API\RolePermissionController@setRoleUser')->name('set-role-user');

    //user
    Route::get('user-authenticated', 'API\UserController@getUserLogin')->name('user.authenticated');
    Route::get('user-lists', 'API\UserController@userLists')->name('user.index');

    //notifikasi
    Route::resource('notification', 'API\NotificationController')->except(['create', 'destroy']);

    //expenses
    Route::post('expenses/accept', 'API\ExpensesController@accept')->name('expenses.accept');
    Route::post('expenses/cancel', 'API\ExpensesController@cancelRequest')->name('expenses.cancel');
    Route::resource('expenses', 'API\ExpensesController')->except(['create', 'show']);

    //Customers
    Route::resource('customer', 'API\CustomerController')->except(['create', 'show']);
});
