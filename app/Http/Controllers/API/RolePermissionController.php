<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use App\User;


class RolePermissionController extends Controller
{
    //ambil semua role yang sudah ditambahkan
    public function getAllRole()
    {
        $roles = Role::all();
        return response()->json([
            'status' => 'success',
            'data' => $roles
        ]);
    }

    //ambil permission yang ada
    public function getAllPermission()
    {
        $permission = Permission::all();
        return response()->json([
            'status' => 'success',
            'data' => $permission
        ]);
    }

    //ambil permission yang dimiliki role tertentu
    public function getRolePermission(Request $request)
    {
        $hasPermission = DB::table('role_has_permissions')
        ->select('permissions.name')
        ->join('permissions', 'role_has_permissions.permission_id', '=', 'permissions.id')
        ->where('role_id', $request->role_id)->get();

        return response()->json([
            'status' => 'succes',
            'data' => $hasPermission
            ]);
    }

    //fungsi untuk menyimpan permission role yang dipilih
    public function setRolePermission(Request $request)
    {
        //validasi
        $this->validate($request, [
            'role_id' => 'required|exists:roles,id'
        ]);
        //ambil role berdasarkan ID
        $role = Role::findOrFail($request->role_id);
        //set permission untuk role tersebut
        //syncPermission bekerja dengan cara menghapus semua role
        //yang dimiliki, kemudian menyimpan data yan baru
        $role->syncPermissions($request->permissions);

        return response()->json([
            'status' => 'success'
        ]);
    }

    //mengatur role setiap user
    public function setRoleUser(Request $request)
    {
        //validasi
        $this->validate($request, [
            'user_id' => 'required|exists:users,id',
            'role' => 'required'
        ]);

        $user = User::findOrFail($request->user_id); //ambil user berdasarkan ID
        $user->syncRoles([$request->role]); //set role untuk user terkait

        return response()->json([
            'status' => 'success'
        ]);
    }
}
