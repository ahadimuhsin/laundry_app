<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
use App\Http\Resources\UserCollection;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    //menampilkan seluruh data user
    public function index()
    {
        $users = User::with(['outlet'])->orderBy('created_at', 'DESC')->courier();

        if(request()->q != '')
        {
            $users = $users->where('name', 'LIKE', '%'.request()->q.'%');
        }

        $users = $users->paginate(10);

        return new UserCollection($users);
    }

    //fungsi menyimpan data inputan ke database
    public function store (Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|string',
            'outlet_id' => 'required|exists:outlets,id',
            'photo' => 'required|image'
        ]);

        DB::beginTransaction();
        try{
            $name = NULL;
            //apabila file photo dikirim
            if ($request->hasFile('photo'))
            {
                //file tersebut disimpan ke storage/app/public/couriers
                $file = $request->file('photo');
                $name = $request->email.'-'.Carbon::now()->format('Y-m-d H-i-s').'.'.$file->getClientOriginalExtension();
                $file->storeAs('public/couriers', $name);
            }

            //simpan data kurir ke database
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'photo' => $name,
                'outlet_id' => $request->outlet_id,
                'role' => 3
            ]);
            //menambahkan role courier ke user yang sudah disimpan
            $user->assignRole('courier');
            
            //jika berhasil semua, data akan disimpan ke dalam database
            DB::commit();
            return response()->json([
                'status' => 'success'
            ], 200);
        }
        //apabila ada error, data akan dirollback
        catch (Exception $e)
        {
            DB::rollback();
            return response()->json(
                ['status' => 'error',
                'data' => $e->getMessage()], 200
            );
        }
    }

    //fungsi untuk mengambil data kurir berdasarkan ID
    public function edit($id)
    {
        $user = User::findOrFail($id);
        return response()->json(
            [
                'status' => 'success',
                'data' => $user
            ], 200
        );
    }

    //fungsi untuk update data kurir
    public function update (Request $request, $id)
    {
        //validasi data
        $this->validate($request, [
            'name' => 'required|string|max:150',
            // 'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|min:6|string',
            'outlet_id' => 'required|exists:outlets,id',
            'photo' => 'nullable|image'
        ]);

        try {
            $user = User::findOrFail($id);

            //jika form password diisi, password akan diperbarui
            $password = $request->password != '' ? Hash::make($request->password) : $user->password;
            //mengambil data photo
            $filename = $user->photo;

            //jika ada file baru yang dikirimkan
            if ($request->hasFile('photo')){
                //foto yg lama akan diganti
                $file = $request->file('photo');
                //kemudian foto itu dihapus
                File::delete(storage_path('app/public/couriers/'.$filename));
                $filename = $request->email .'-'. Carbon::now()->format('Y-m-d H-i-s') . '-'.$file->getClientOriginalExtension();
                $file->storeAs('public/couriers', $filename);
            }

            //perbarui data yang ada di database
            $user->update([
                'name' => $request->name,
                'password' => $password,
                'photo' => $filename,
                'outlet_id' => $request->outlet_id
            ]);
            return response()->json(
                ['status' => 'success'], 200
            );
        }
        //apabila terjadi error
        catch(Exception $e)
        {
            return response()->json(
                ['status' => 'error', 'data' => $e->getMessage()], 200
            );
        }
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        File::delete(storage_path('app/public/couriers/' .$user->photo));
        $user->delete();

        return response()->json(['status' => 'success'],200);
    }

    //mengambil seluruh data user yang bukan kurir
    public function userLists(){
        $user = User::where('role', '!=', 3)->get();

        return new UserCollection($user);
    }

    //ambil data user yang login
    public function getUserLogin()
    {
        $user = request()->user(); //ambil data user yang sedang login
        $permissions = [];
        //untuk tiap permission
        foreach(Permission::all() as $permission){
            //jika user yang sedang login punya permission terkait
            if(request()->user()->can($permission->name)){
                //permission tersebut ditambahkan
                $permissions[] = $permission->name;
            }
        }

        $user['permission'] = $permissions; //permission yang dimiliki dimasukkan ke dalam data user
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }
}
