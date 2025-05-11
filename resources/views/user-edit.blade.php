<!-- Edit user -->
<form class="form-edit-user" action="{{ route("user.update", $user->uuid) }}" method="post">
    <input type="hidden" name="_token" value="{{ $csrf }}">
    @method('put')

    <!-- Button remove form -->
    <button type="button" class="btn btn-remove-form" data-tooltip="true" data-tooltip-title="Remove form" aria-label="Button to remove form" onclick="this.closest('form').remove(); // Remove form"></button>

    <label for="input-name" class="input-label">Name <span class="required-label"></span></label>
    <input type="text" class="input input-control" name="name" id="input-name" maxlength="120" data-tooltip="true" data-tooltip-title="Isikan dengan nama yang valid!" value="{{ $user->name }}" aria-required="true" required>
    <label for="input-email" class="input-label">Email <span class="required-label"></span></label>
    <input type="email" inputmode="email" class="input input-control" name="email" id="input-email" maxlength="254" data-tooltip="true" data-tooltip-title="Isikan dengan alamat email yang valid dan aktif!" value="{{ $user->email }}" aria-required="true" required>
    <label for="input-role" class="input-label">Role <span class="required-label"></span></label>
    <select class="input input-control" name="role" id="input-role" aria-required="true" required>
        <option value="admin" disabled>Administrator</option>
        <option value="participant" @selected($user->role === 'participant')>Participant</option>
    </select>

    <button type="submit" role="button" class="btn" data-tooltip="true" data-tooltip-title="Submit form" aria-label="Button to submit form">Simpan</button>
</form>