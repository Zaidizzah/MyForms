@extends('layouts.app')

@section('container')
    
    <div class="tablist-container" role="region" aria-label="Tablist">
        <div role="tablist" class="tablist">
            <button id="tab-users" role="tab" class="tab btn" data-tooltip="true" data-tooltip-title="Data-data user" aria-disabled="true" aria-selected="true" aria-controls="panel-users">
                <img src="{{ asset("images/application icons/users plus.png") }}" class="tab-icon" loading="lazy" alt="Forms icon" /> Data users
            </button>
            <button id="tab-form-add-user" role="tab" class="tab btn" data-tooltip="true" data-tooltip-title="Tambah data user baru" aria-disabled="false" aria-selected="false" aria-controls="panel-form-add-user">
                <img src="{{ asset("images/application icons/forms.png") }}" class="tab-icon" loading="lazy" alt="Forms icon" /> Add User
            </button>
            <button id="tab-form-edit-user" role="tab" class="tab btn" data-tooltip="true" data-tooltip-title="Update data user" aria-disabled="false" aria-selected="false" aria-controls="panel-form-edit-user">
                <img src="{{ asset("images/application icons/forms.png") }}" class="tab-icon" loading="lazy" alt="Forms icon" /> Update User
            </button>
        </div>

        <div id="panel-users" role="tabpanel" class="tabpanel" aria-hidden="false" aria-labelledby="tab-users" aria-describedby="panel-users-title">
            <div class="panel-title" id="panel-users-title">
                <h1>Tabel pengguna</h1>
                <p>Kelola data-data pengguna yang telah ditambahkan di sini.</p>
            </div>

            <form class="search-wrapper" action="{{ route("user.index") }}" method="get">
                <input type="search" name="search" class="input" id="search-user" role="search" aria-label="Cari data-data pengguna" aria-placeholder="Cari data-data pengguna" aria-required="false" placeholder="Cari data-data pengguna..." value="{{ request('search') }}" />
                <button type="submit" role="button" class="btn" data-tooltip="true" data-tooltip-title="Cari data-data pengguna berdasarkan kata kunci nama, email, ataupun role">Cari</button>
                <button type="button" role="button" class="btn btn-reset" id="reset-table-order" data-tooltip="true" data-tooltip-title="Reset urutan kolom tabel" aria-controls="tabel-user">Reset</button>
            </form>

            <div class="table-wrapper" tabindex="0">
                <table class="simple" id="tabel-user" role="table" aria-labelledby="tabel-user-caption" data-base-url-edit="{{ route("api.user.show", ":uuid") }}" orderable="true">
                    <caption id="tabel-user-caption">Data-data pengguna aplikasi MYFORMS</caption>
                    <thead>
                        <tr>
                            <th scope="col" data-original-index="0">
                                <div class="drag-indicator" aria-hidden="true"></div>
                                No
                            </th>
                            <th scope="col" data-original-index="1">
                                <div class="drag-indicator" aria-hidden="true"></div>
                                Name
                            </th>
                            <th scope="col" data-original-index="2" data-draggable="false">
                                <div class="drag-indicator" aria-hidden="true"></div>
                                Email
                            </th>
                            <th scope="col" data-original-index="3">
                                <div class="drag-indicator" aria-hidden="true"></div>
                                Role
                            </th>
                            <th scope="col" data-original-index="4">
                                <div class="drag-indicator" aria-hidden="true"></div>
                                Bergabung pada
                            </th>
                            <th scope="col" data-original-index="5">
                                <div class="drag-indicator" aria-hidden="true"></div>
                                Terakhir diubah
                            </th>
                            <th scope="col" data-original-index="6">
                                <div class="drag-indicator" aria-hidden="true"></div>
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        @if ($users->isEmpty())
                            <tr>
                                <th scope="row" colspan="7" class="no-data" align="center">
                                    @if (empty(request('search')) === FALSE)
                                        Tidak ada data yang sesuai dengan pencarian "{{ request('search') }}".
                                    @else
                                        Tidak ada data yang ditemukan.
                                    @endif
                                </th>
                            </tr>
                        @else
                            @foreach ($users as $key => $user)
                                @php
                                    // Convert role to UPPERCASE
                                    $user->role = $user->role === 'admin' ? 'ADMINISTRATOR' : 'PARTICIPANT';

                                    // Highlight search result if search query is not empty
                                    if (empty(request('search')) === FALSE) {
                                        $user->name = preg_replace(
                                                "/(" . request('search') . ")/i",
                                                '<span class="highlight">$1</span>',
                                                $user->name
                                            );
                                        $user->email = preg_replace(
                                                "/(" . request('search') . ")/i",
                                                '<span class="highlight">$1</span>',
                                                $user->email
                                            );
                                        $user->role = preg_replace(
                                                "/(" . request('search') . ")/i",
                                                '<span class="highlight">$1</span>',
                                                $user->role
                                            );
                                    }
                                @endphp

                                <tr>
                                    <th scope="row">{{ ++$key }}</th>
                                    <td>{!! $user->name !!}</td>
                                    <td>{!! $user->email !!}</td>
                                    <td>{!! $user->role !!}</td>
                                    <td>{{ $user->created_at->format("d F Y H:i A") }}</td>
                                    <td>{{ $user->updated_at->format("d F Y H:i A") }}</td>
                                    <td aria-label="action">
                                        <button type="button" role="button" class="btn edit-user-button" data-tooltip="true" data-tooltip-title="Edit data user '{{ $user->name }}'" data-uuid=":{{ $user->uuid }}">
                                            Edit
                                        </button>
                                        <form class="form-delete-user" action="{{ route("user.destroy", $user->uuid) }}" method="post">
                                            @csrf
                                            @method('delete')

                                            <button type="submit" role="button" class="btn delete-user-button" data-tooltip="true" data-tooltip-title="Hapus data user '{{ $user->name }}'">
                                                Hapus
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        @endif
                    </tbody>
                </table>
            </div>
        </div>
        
        <div id="panel-form-add-user" role="tabpanel" class="tabpanel" aria-hidden="true" aria-labelledby="tab-form-add-user" aria-describedby="panel-form-add-user-title">
            <div class="panel-title" id="panel-form-add-user-title">
                <h1>Formulir tambah pengguna</h1>
                <p>Formulir ini digunakan untuk menambahkan data pengguna baru.</p>
            </div>

            <form class="form-add-user" action="{{ route("user.store") }}" method="post">
                @csrf

                <label for="input-name" class="input-label">Name <span class="required-label"></span></label>
                <input type="text" class="input input-control" name="name" id="input-name" maxlength="120" data-tooltip="true" data-tooltip-title="Isikan dengan nama yang valid!" aria-required="true" required>
                <label for="input-email" class="input-label">Email <span class="required-label"></span></label>
                <input type="email" inputmode="email" class="input input-control" name="email" id="input-email" maxlength="254" data-tooltip="true" data-tooltip-title="Isikan dengan alamat email yang valid dan aktif!" aria-required="true" required>
                <label for="input-role" class="input-label">Role <span class="required-label"></span></label>
                <select class="input input-control" name="role" id="input-role" aria-required="true" required>
                    <option value="admin" disabled>Administrator</option>
                    <option value="participant" selected>Participant</option>
                </select>
                <label for="input-password" class="input-label">Password <span class="required-label"></span></label>
                <input type="password" class="input input-control" name="password" id="input-password"
                    oninput="
                        // Add password value to confirm password input pattern
                        const confirmInput = document.getElementById('input-password-confirmation');
                        const regex = new RegExp(this.value); 
                        if (confirmInput && regex) {
                            confirmInput.pattern = this.value;
                        }
                    "             
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$" autocomplete="new-password" minlength="8" maxlength="15" data-tooltip="true" data-tooltip-title="Isikan dengan password yang kuat serta berisi setidaknya 1 huruf besar, 1 huruf kecil, 1 simbol, dan 1 angka dengan minimum 8 karakter dan maksimum 15 karakter!" aria-required="true" required>
                <label for="input-password-confirmation" class="input-label">Confirm Password <span class="required-label"></span></label>
                <input type="password" class="input input-control" name="password_confirmation" id="input-password-confirmation" autocomplete="new-password" minlength="8" maxlength="15" data-tooltip="true" data-tooltip-title="Isikan ulang password yang telah kamu inputkan dikolom atas/sebelumnya!" aria-required="true" required>

                <button type="submit" role="button" class="btn" data-tooltip="true" data-tooltip-title="Submit form" aria-label="Button to submit form">Simpan</button>
            </form>
        </div>
        
        <div id="panel-form-edit-user" role="tabpanel" class="tabpanel" aria-hidden="true" aria-labelledby="tab-form-edit-user">
            <div class="panel-title" id="panel-form-edit-user-title">
                <h1>Formulir edit pengguna</h1>
                <p>Formulir ini digunakan untuk mengedit atau mengubah data pengguna yang ada.</p>
            </div>

        </div>
    </div>

@endsection