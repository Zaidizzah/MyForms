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
        return $this->errorResponse($message, $errors, statusCode: 422);
    }

    /**
     * Format not found response
     * 
     * @param string $resource Name of the not found resource
     * @return \Illuminate\Http\JsonResponse
     */
    public function notFoundResponse(string $resource = 'Resource')
    {
        return $this->errorResponse("{$resource} not found", statusCode: 404);
    }

    /**
     * Format unauthorized response
     * 
     * @param string $message Unauthorized message
     * @return \Illuminate\Http\JsonResponse
     */
    public function unauthorizedResponse(string $message = 'Unauthorized')
    {
        return $this->errorResponse($message, statusCode: 401);
    }

    /**
     * Format forbidden response
     * 
     * @param string $message Forbidden message
     * @return \Illuminate\Http\JsonResponse
     */
    public function forbiddenResponse(string $message = 'Forbidden')
    {
        return $this->errorResponse($message, statusCode: 403);
    }

    /**
     * Format created resource response
     * 
     * @param array $data Created resource data
     * @param string $resourceName Resource name
     * @return \Illuminate\Http\JsonResponse
     */
    public function createdResponse(array $data = [], string $resourceName = 'Resource')
    {
        return $this->successResponse($data, message: "{$resourceName} created successfully", statusCode: 201);
    }

    /**
     * Format updated resource response
     * 
     * @param array $data Updated resource data
     * @param string $resourceName Resource name
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatedResponse(array $data = [], string $resourceName = 'Resource')
    {
        return $this->successResponse($data, message: "{$resourceName} updated successfully");
    }

    /**
     * Format deleted resource response
     * 
     * @param string $resourceName Resource name
     * @return \Illuminate\Http\JsonResponse
     */
    public function deletedResponse(string $resourceName = 'Resource')
    {
        return $this->successResponse(message: "{$resourceName} deleted successfully");
    }

    /**
     * Response for server error 
     * 
     * @param string $message Error message
     * @param mixed $exception Exception object (optional)
     * @return \Illuminate\Http\JsonResponse
     */
    public function serverErrorResponse(string $message = 'Server Error occurred, please stay tuned', $exception = null)
    {
        $response = [
            'success' => false,
            'message' => $message
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
