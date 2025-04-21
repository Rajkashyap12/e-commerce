import { supabase } from "../lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// API base URL - will use Supabase as fallback if Java backend is not available
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

// Helper function to determine if we should use Java backend or Supabase
const useJavaBackend = async (): Promise<boolean> => {
  try {
    // Try to ping the Java backend
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Short timeout to quickly fall back to Supabase if Java backend is not available
      signal: AbortSignal.timeout(1000),
    });
    return response.ok;
  } catch (error) {
    console.log("Java backend not available, falling back to Supabase");
    return false;
  }
};

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string,
): Promise<AuthUser> {
  // Try Java backend first
  if (await useJavaBackend()) {
    try {
      console.log("Attempting to sign in with Java backend");
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Java login response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login error response:", errorText);
        let errorMessage = "Failed to sign in";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If the response is not valid JSON, use the error text
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Login successful, received data:", data);

      // Store the auth token in localStorage
      localStorage.setItem("authToken", data.token);

      return {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      };
    } catch (error: any) {
      console.error(
        "Error signing in with Java backend, falling back to Supabase:",
        error,
      );
      // Fall back to Supabase if Java backend fails
    }
  }

  // Supabase fallback
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("No user returned from authentication");
    }

    // Get user profile data from the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError && userError.code !== "PGRST116") {
      console.error("Error fetching user data:", userError);
    }

    return {
      id: data.user.id,
      email: data.user.email || "",
      firstName: userData?.first_name,
      lastName: userData?.last_name,
    };
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw error;
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(data: SignupData): Promise<AuthUser> {
  // Try Java backend first
  if (await useJavaBackend()) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up");
      }

      const responseData = await response.json();

      // Store the auth token in localStorage if provided
      if (responseData.token) {
        localStorage.setItem("authToken", responseData.token);
      }

      return {
        id: responseData.user.id,
        email: responseData.user.email,
        firstName: responseData.user.firstName,
        lastName: responseData.user.lastName,
      };
    } catch (error: any) {
      console.error(
        "Error signing up with Java backend, falling back to Supabase:",
        error,
      );
      // Fall back to Supabase if Java backend fails
    }
  }

  // Supabase fallback
  try {
    // Create auth user
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.user) {
      throw new Error("No user returned from registration");
    }

    // Create user profile in the users table
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        created_at: new Date().toISOString(),
      },
    ]);

    if (profileError) {
      console.error("Error creating user profile:", profileError);
      // We don't throw here because the auth user was created successfully
      // In a production app, you might want to delete the auth user if profile creation fails
    }

    return {
      id: authData.user.id,
      email: authData.user.email || "",
      firstName: data.firstName,
      lastName: data.lastName,
    };
  } catch (error: any) {
    console.error("Sign up error:", error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  // Try Java backend first
  if (await useJavaBackend()) {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Error signing out from Java backend");
        }

        // Remove the auth token from localStorage
        localStorage.removeItem("authToken");
        return;
      }
    } catch (error) {
      console.error(
        "Error signing out from Java backend, falling back to Supabase:",
        error,
      );
      // Fall back to Supabase if Java backend fails
    }
  }

  // Supabase fallback
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // Try Java backend first
  if (await useJavaBackend()) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // If unauthorized, clear the token
        if (response.status === 401) {
          localStorage.removeItem("authToken");
        }
        return null;
      }

      const data = await response.json();
      return {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      };
    } catch (error) {
      console.error(
        "Error getting current user from Java backend, falling back to Supabase:",
        error,
      );
      // Fall back to Supabase if Java backend fails
    }
  }

  // Supabase fallback
  try {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return null;
    }

    // Get user profile data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError && userError.code !== "PGRST116") {
      console.error("Error fetching user data:", userError);
    }

    return {
      id: data.user.id,
      email: data.user.email || "",
      firstName: userData?.first_name,
      lastName: userData?.last_name,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
