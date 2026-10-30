import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import { ApiError } from "@/api/client";
import { AuthScreen } from "@/components/AuthScreen";
import { ErrorBox } from "@/components/ErrorBox";
import { FormField } from "@/components/FormField";
import { PasswordField } from "@/components/PasswordField";
import { useAuth } from "@/context/AuthContext";
import {
  validateAge,
  validateEmail,
  validateFirstname,
  validateLastname,
  validateNewPassword,
} from "@/utils/validation";

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState("");
  // Errors only appear after the first submit, so an empty form is not shown as wrong.
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const emailError = validateEmail(email);
  const passwordError = validateNewPassword(password);
  const firstnameError = validateFirstname(firstname);
  const lastnameError = validateLastname(lastname);
  const ageError = validateAge(age);

  async function handleRegister() {
    setIsSubmitted(true);
    setFailure(null);
    if (emailError || passwordError || firstnameError || lastnameError || ageError) {
      return;
    }

    setIsSubmitting(true);
    try {
      // After the sign up, the root layout switches to the tabs.
      await register({
        email: email.trim(),
        password,
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        age: Number(age),
      });
    } catch (error) {
      setFailure(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen
      title="Create account"
      subtitle="Fields marked * are required."
      header={
        <Button icon="chevron-left" mode="text" compact onPress={() => router.back()} style={styles.back}>
          Log in
        </Button>
      }
      submitLabel="Sign up"
      isSubmitting={isSubmitting}
      onSubmit={handleRegister}
      switchText="Already have an account?"
      switchLabel="Log in"
      onSwitch={() => router.back()}
    >
      {failure && <ErrorBox title="Sign up failed" message={failure} />}
      <FormField
        label="Email *"
        placeholder="name@example.ch"
        value={email}
        onChangeText={setEmail}
        error={isSubmitted ? emailError : undefined}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      <PasswordField
        label="Password *"
        placeholder="Password"
        hint="At least 4 characters."
        value={password}
        onChangeText={setPassword}
        error={isSubmitted ? passwordError : undefined}
      />
      <FormField
        label="First name *"
        placeholder="e.g. Max"
        value={firstname}
        onChangeText={setFirstname}
        error={isSubmitted ? firstnameError : undefined}
        autoComplete="given-name"
      />
      <FormField
        label="Last name *"
        placeholder="e.g. Muster"
        value={lastname}
        onChangeText={setLastname}
        error={isSubmitted ? lastnameError : undefined}
        autoComplete="family-name"
      />
      <FormField
        label="Age *"
        placeholder="e.g. 25"
        value={age}
        onChangeText={setAge}
        error={isSubmitted ? ageError : undefined}
        keyboardType="number-pad"
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  back: {
    alignSelf: "flex-start",
  },
});
