@extends('layouts.app')

@section('container')

    {{-- <form action="{{ route("api.file.upload") }}" method="post" enctype="multipart/form-data">
        @csrf

        <input type="file" class="input" name="file">
        <select class="input" name="context">
            <option value="question">Question</option>
            <option value="option">Option</option>
        </select>
        <input type="datetime" class="input" name="timestamp" value="{{ now()->timestamp }}" readonly>

        <button type="submit" role="button" class="btn" data-tooltip="true" data-tooltip-title="Upload file">Upload</button>
    </form> --}}

    <div class="container" id="form-builder" role="region" data-base-url="{{ route("api.form.store") }}" data-upload-url="{{ route("api.file.upload") }}" data-delete-url="{{ route("api.file.delete") }}" aria-labelledby="form-builder-header" aria-describedby="form-builder-body">
        <!-- Question Counter -->
        <span id="question-counter" class="question-counter" role="status" aria-live="polite" aria-atomic="true" aria-label="Jumlah pertanyaan"
        data-tooltip="true" data-tooltip-title="Jumlah pertanyaan yang ada yaitu 0">Jumlah pertanyaan: 0</span></span>

        <!-- Tab List anchor -->
        <div class="lists-anchor" id="lists-anchor" role="tablist" aria-label="Tab List Anchor for Form Builder">
            <!-- Anchor item toggler -->
            <button type="button" role="button" class="lists-anchor-toggler" data-tooltip="true" data-tooltip-title="Toggle tab list anchor" aria-label="Button to toggle visibility of tab list anchor"><span></span></button>

            <div class="lists-scroll" role="scrollbar" aria-label="Scroller for Tab List Anchor for Form Builder" aria-expanded="false">
                <!-- More tab list anchor items is added here -->   
            </div>
        </div>

        <div class="header" id="form-builder-header">
            <h1>🎯 MyForms</h1>
            <p>Buat formulir dan quiz interaktif dengan mudah</p>
        </div>

        <div class="form-builder" id="form-builder-body" aria-labelledby="form-builder-sidebar" aria-describedby="form-builder-content">
            <div class="sidebar" id="form-builder-sidebar">
                <h3>Jenis Pertanyaan</h3>
                <div class="question-types">
                    <div class="question-type" role="button" data-type="text" id="question-type-text" aria-selected="false" data-tooltip="true" data-tooltip-title="Pertanyaan teks singkat">
                        <span class="question-type-icon">📝</span>
                        <span>Teks Singkat</span>
                    </div>
                    <div class="question-type" role="button" data-type="textarea" id="question-type-textarea" aria-selected="false" data-tooltip="true" data-tooltip-title="Pertanyaan teks panjang">
                        <span class="question-type-icon">📄</span>
                        <span>Teks Panjang</span>
                    </div>
                    <div class="question-type" role="button" data-type="number" id="question-type-number" aria-selected="false" data-tooltip="true" data-tooltip-title="Pertanyaan angka">
                        <span class="question-type-icon">🔢</span>
                        <span>Angka</span>
                    </div>
                    <div class="question-type" role="button" data-type="date" id="question-type-date" aria-selected="false" data-tooltip="true" data-tooltip-title="Pertanyaan tanggal">
                        <span class="question-type-icon">📅</span>
                        <span>Tanggal</span>
                    </div>
                    <div class="question-type" role="button" data-type="radio" id="question-type-radio" aria-selected="false" data-tooltip="true" data-tooltip-title="Pertanyaan pilihan ganda">
                        <span class="question-type-icon">⚪</span>
                        <span>Pilihan Ganda</span>
                    </div>
                    <div class="question-type" role="button" data-type="checkbox" id="question-type-checkbox" aria-selected="false" data-tooltip="true" data-tooltip-title="Pertanyaan kotak centang">
                        <span class="question-type-icon">☑️</span>
                        <span>Kotak Centang</span>
                    </div>
                    <div class="question-type" role="button" data-type="dropdown" id="question-type-dropdown" aria-selected="false" data-tooltip="true" data-tooltip-title="Pertanyaan dropdown">
                        <span class="question-type-icon">📋</span>
                        <span>Dropdown</span>
                    </div>
                    <div class="question-type" role="button" data-type="file" id="question-type-file" aria-selected="false" data-tooltip="true" data-tooltip-title="Pertanyaan upload file">
                        <span class="question-type-icon">📎</span>
                        <span>Upload File</span>
                    </div>
                </div>
            </div>

            <div class="form-content" id="form-builder-content" aria-label="Form builder form" aria-describedby="form-builder-content-details">
                <div class="form-details form-builder-content-details" id="form-builder-content-details" role="form">
                    <div class="form-group">
                        <label for="form-title">Judul Formulir</label>
                        <input type="text" id="form-title" placeholder="Masukkan judul formulir..." aria-required="true" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="form-description">Deskripsi Formulir</label>
                        <textarea id="form-description" placeholder="Jelaskan tujuan formulir ini..." aria-required="false"></textarea>
                    </div>
                    
                    <div class="form-settings">
                        <div class="form-group">
                            <label for="form-type">Jenis Formulir</label>
                            <select id="form-type">
                                <option value="form" selected>Formulir</option>
                                <option value="quiz">Quiz</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="allow-edit" aria-checked="false" aria-required="false" data-tooltip="true" data-tooltip-title="Izinkan edit jawaban setelah submit">
                                <label for="allow-edit">Izinkan Edit Jawaban</label>
                            </div>
                            <div class="checkbox-group">
                                <input type="checkbox" id="only-once" checked aria-checked="true" aria-required="false" data-tooltip="true" data-tooltip-title="Hanya dapat submit sekali">
                                <label for="only-once">Hanya Sekali Submit</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="questions-container" id="questions-container" role="region" aria-labelledby="questions-header">
                    <div class="questions-header" id="questions-header">
                        <h3>Pertanyaan</h3>
                        <button type="button" role="button" class="btn add-question-btn" data-tooltip="true" data-tooltip-title="Tambah pertanyaan baru">+ Tambah Pertanyaan</button>
                    </div>
                    
                    <div class="questions-list" id="questions-list" role="list" aria-label="List of questions">
                        <div class="empty-state" role="listitem">
                            <div class="empty-state-icon">
                                <img class="icon" src="{{ asset("images/application icons/empty state.jpg") }}" loading="lazy" alt="Empty state icon">
                            </div>
                            <h4>Belum ada pertanyaan</h4>
                            <p>Klik "Tambah Pertanyaan" atau pilih jenis pertanyaan di sebelah kiri untuk memulai</p>
                        </div>
                    </div>
                </div>

                <div class="btn-group">
                    <button type="button" role="button" class="btn reset-form-btn" data-tooltip="true" data-tooltip-title="Reset formulir">Reset Formulir</button>
                    <button type="button" role="button" class="btn save-form-btn" data-tooltip="true" data-tooltip-title="Simpan formulir">Simpan Formulir</button>
                </div>
            </div>
        </div>
    </div>

@endsection