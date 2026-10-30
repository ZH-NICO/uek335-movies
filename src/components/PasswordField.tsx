import { useState } from "react";
import { TextInput } from "react-native-paper";

import { FormField, type FormFieldProps } from "@/components/FormField";

// Password field with an eye icon to show or hide the entry.
export function PasswordField(props: Omit<FormFieldProps, "secureTextEntry" | "right">) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormField
      {...props}
      autoCapitalize="none"
      autoCorrect={false}
      secureTextEntry={!isVisible}
      right={
        <TextInput.Icon
          icon={isVisible ? "eye-off-outline" : "eye-outline"}
          accessibilityLabel={isVisible ? "Hide password" : "Show password"}
          onPress={() => setIsVisible(!isVisible)}
        />
      }
    />
  );
}
