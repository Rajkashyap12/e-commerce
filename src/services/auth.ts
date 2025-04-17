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

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string,
): Promise<AuthUser> {
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
