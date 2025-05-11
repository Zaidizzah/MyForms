@extends('layouts.app')

@section('container')
    
    <button type="button" role="button" class="btn btn-add-form" data-tooltip="true" data-tooltip-title="Add form" aria-label="Button to add form">
        <img class="icon" src="{{ asset("images/application icons/add plus.svg") }}" loading="lazy" alt="Add new form icon">
    </button>

    <div class="forms-container">
        <div class="form-list" id="form-list" role="list" aria-label="List of forms">
            <div class="form-item" role="listitem" data-tooltip="true" data-tooltip-title="Form 1">
                <div class="form-item-icon">
                    <img class="icon" src="{{ asset("images/application icons/forms.png") }}" loading="lazy" alt="Form icon">
                </div>
                <span class="form-item-title">Form 1</span>
            </div>
            <div class="form-item" role="listitem" data-tooltip="true" data-tooltip-title="Form 2">
                <div class="form-item-icon">
                    <img class="icon" src="{{ asset("images/application icons/forms.png") }}" loading="lazy" alt="Form icon">
                </div>
                <span class="form-item-title">Form 2</span>
            </div>
            <div class="form-item" role="listitem" data-tooltip="true" data-tooltip-title="Form 3">
                <div class="form-item-icon">
                    <img class="icon" src="{{ asset("images/application icons/forms.png") }}" loading="lazy" alt="Form icon">
                </div>
                <span class="form-item-title">Form 3</span>
            </div>
        </div>
        <div class="form-info" id="form-info" aria-label="Form info" aria-labelledby="form-info-header" aria-describedby="form-info-body">
            <div class="form-info-header" id="form-info-header">
                <h2 class="form-info-title">Form 1</h2>
                <div class="form-info-header-right">
                    <button type="button" role="button" class="btn btn-show-form" data-tooltip="true" data-tooltip-title="Lihat form" aria-label="Button to show form">Lihat</button>
                    <button type="button" role="button" class="btn btn-statistik-form" data-tooltip="true" data-tooltip-title="Lihat statistik form" aria-label="Button to show statistik form">Statistik</button>
                    <button type="button" role="button" class="btn btn-edit-form" data-tooltip="true" data-tooltip-title="Edit form" aria-label="Button to edit form">Edit</button>
                    <button type="button" role="button" class="btn btn-delete-form" data-tooltip="true" data-tooltip-title="Delete form" aria-label="Button to delete form">Hapus</button>
                </div>
            </div>
            <div class="form-info-body" id="form-info-body">
                <div class="form-info-body-item">
                    <span class="form-info-body-item-title">Judul formulir</span>
                    <span class="form-info-body-item-value">Form 1</span>
                </div>
                <div class="form-info-body-item">
                    <span class="form-info-body-item-title">Deskripsi formulir</span>
                    <span class="form-info-body-item-value">This is a form</span>
                </div>
                <div class="form-info-body-item">
                    <span class="form-info-body-item-title">Dibuat pada</span>
                    <span class="form-info-body-item-value">2 Mei 2025</span>
                </div>
                <div class="form-info-body-item">
                    <span class="form-info-body-item-title">Terakhir diubah pada</span>
                    <span class="form-info-body-item-value">11 Mei 2025</span>
                </div>
            </div>
        </div>
    </div>

@endsection