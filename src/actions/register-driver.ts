'use server';

export async function registerDriverAction(formData: FormData) {
  try {
    // Note: The base URL must be absolute for server-side fetching.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
    const response = await fetch(`${baseUrl}/api/register-driver`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      // If response is not OK, use the error message from the API
      return { error: result.error || `Request failed with status ${response.status}` };
    }

    return result; // Should be { driverId: '...' } on success

  } catch (error: any) {
    console.error("Registration action failed:", error);
    // This catches network errors or issues with the fetch call itself
    return { error: `An unexpected error occurred in the action: ${error.message}` };
  }
}
