<?php

namespace App\Traits;

trait ApiResponse
{
    /**
     * Format success response
     * 
     * @param mixed $data Data to be sent
     * @param string $message Success message
     * @param int $statusCode HTTP status code
     * @return \Illuminate\Http\JsonResponse
     */
    public function successResponse(array $data = [], string $message = 'Success', int $statusCode = 200)
    {
        $response = [
            'success' => true,
            'message' => $message,
            ...$data
        ];

        return response()->json($response, $statusCode);
    }

    /**
     * Format error response
     * 
     * @param string $message Error message
     * @param mixed $errors Error details (optional)
     * @param int $statusCode HTTP status code
     * @return \Illuminate\Http\JsonResponse
     */
    public function errorResponse(string $message = 'Error', array $errors = [], int $statusCode = 400)
    {
        $response = [
            'success' => false,
            'message' => $message,
            ...$errors
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Format validation error response
     * 
     * @param array $errors Array of validation errors
     * @param string $message Error message
     * @return \Illuminate\Http\JsonResponse
     */
    public function validationErrorResponse(array $errors, string $message = 'Validation Error')
    {
        return $this->errorResponse($message, $errors, 422);
    }

    /**
     * Format not found response
     * 
     * @param array $errors Not found data
     * @param string $message Name of the not found resource
     * @return \Illuminate\Http\JsonResponse
     */
    public function notFoundResponse(array $errors = [], string $message = 'Resource')
    {
        return $this->errorResponse("{$message} not found", $errors, 404);
    }

    /**
     * Format unauthorized response
     * 
     * @param array $data Unauthorized data
     * @param string $errors Unauthorized message
     * @return \Illuminate\Http\JsonResponse
     */
    public function unauthorizedResponse(array $data = [], string $errors = 'Unauthorized')
    {
        return $this->errorResponse($errors, $data, 401);
    }

    /**
     * Format forbidden response
     * 
     * @param array $data Forbidden data
     * @param string $errors Forbidden message
     * @return \Illuminate\Http\JsonResponse
     */
    public function forbiddenResponse(array $data = [], string $errors = 'Forbidden')
    {
        return $this->errorResponse($errors, $data, 403);
    }

    /**
     * Format created resource response
     * 
     * @param array $data Created resource data
     * @param string $message Resource name
     * @return \Illuminate\Http\JsonResponse
     */
    public function createdResponse(array $data = [], string $message = 'Resource')
    {
        return $this->successResponse($data, "{$message} created successfully", 201);
    }

    /**
     * Format updated resource response
     * 
     * @param array $data Updated resource data
     * @param string $message Resource name
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatedResponse(array $data = [], string $message = 'Resource')
    {
        return $this->successResponse($data, "{$message} updated successfully");
    }

    /**
     * Format deleted resource response
     * 
     * @param array $data Deleted resource data
     * @param string $message Resource name
     * @return \Illuminate\Http\JsonResponse
     */
    public function deletedResponse(array $data = [], string $message = 'Resource')
    {
        return $this->successResponse($data, "{$message} deleted successfully");
    }

    /**
     * Response for server error 
     * 
     * @param array $data Data to be sent
     * @param string $message Error message
     * @param mixed $exception Exception object (optional)
     * @return \Illuminate\Http\JsonResponse
     */
    public function serverErrorResponse(array $data = [], string $message = 'Server Error occurred, please stay tuned', $exception = null)
    {
        $response = [
            'success' => false,
            'message' => $message,
            ...$data
        ];

        if (config('app.debug') && $exception !== null) {
            $response['debug'] = [
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString()
            ];
        }

        return response()->json($response, 500);
    }
}
