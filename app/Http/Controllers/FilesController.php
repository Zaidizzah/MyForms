<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Traits\ApiResponse;
use App\Models\Files as FilesModel;

class FilesController extends Controller
{
    use ApiResponse;
    public const QUESTION_PATH = 'files/questions';
    public const OPTION_PATH = 'files/options';

    public function upload(Request $request)
    {
        $file = $request->file('file');
        $file_path = $file->store($request->input('context') === 'question' ? self::QUESTION_PATH : self::OPTION_PATH, 'public');

        // Check if file upload was successful
        if ($file_path === false) {
            if ($request->acceptsJson()) {
                return $this->errorResponse(message: "File untuk tipe " . ($request->input('context') === 'question' ? 'pertanyaan' : 'pilihan') . " gagal diupload");
            } else {
                return redirect()->back()->with('flash-message', [
                    'type' => 'error',
                    'title' => 'Error',
                    'message' => "File untuk tipe " . ($request->input('context') === 'question' ? 'pertanyaan' : 'pilihan') . " gagal diupload"
                ]);
            }
        }

        $file_data = [
            'file_name' => $file->getClientOriginalName(),
            'file_path' => Storage::url($file_path),
            'file_size' => $file->getSize(),
            'file_type' => $file->getMimeType(),
            'file_extension' => $file->getClientOriginalExtension(),
            'context' => $request->input('context'),
            'timestamp' => $request->input('timestamp')
        ];

        // store data to database
        $stored_file_data = new FilesModel();
        $stored_file_data->user_id = auth()->user()->id ?? null;
        $stored_file_data->file_encrypted_name = $file->hashName();
        $stored_file_data->file_path = $file_data['file_path'];
        $stored_file_data->file_size = $file_data['file_size'];
        $stored_file_data->file_type = $file_data['file_type'];
        $stored_file_data->file_extension = $file_data['file_extension'];
        $stored_file_data->context = $file_data['context'];
        $stored_file_data->timestamp = $file_data['timestamp'];
        $stored_file_data->save();

        // update file id to file data
        if ($stored_file_data->wasRecentlyCreated) {
            $file_data['file_id'] = $stored_file_data->id;
        }

        // Check if the request accepts JSON
        if ($request->acceptsJson()) {
            return $this->successResponse($file_data, "File untuk tipe " . ($request->input('context') === 'question' ? 'pertanyaan' : 'pilihan') . " telah berhasil diupload");
        } else {
            return redirect()->back()->with('flash-message', [
                'type' => 'success',
                'title' => 'Success',
                'message' => "File untuk tipe " . ($request->input('context') === 'question' ? 'pertanyaan' : 'pilihan') . " telah berhasil diupload"
            ]);
        }
    }

    public function delete(Request $request)
    {
        $file_path = $request->input('file_path');
        // file not found, return error response
        if (Storage::disk('public')->exists($file_path)) return $this->errorResponse(message: "File tidak ditemukan");

        if (Storage::disk('public')->delete($file_path)) {
            if ($request->acceptsJson()) {
                return $this->successResponse(message: "File terkait berhasil dihapus");
            } else {
                return redirect()->back()->with('flash-message', [
                    'type' => 'success',
                    'title' => 'Success',
                    'message' => "File terkait berhasil dihapus"
                ]);
            }
        } else {
            if ($request->acceptsJson()) {
                return $this->errorResponse(message: "File terkait gagal dihapus");
            } else {
                return redirect()->back()->with('flash-message', [
                    'type' => 'error',
                    'title' => 'Error',
                    'message' => "File terkait gagal dihapus"
                ]);
            }
        }
    }
}
