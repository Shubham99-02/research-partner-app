import * as React from "react";
import { TouchableOpacity, Text, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/use-colors";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

interface PDFExportButtonProps {
  onPress: () => Promise<{ buffer: string; filename: string }>;
  label?: string;
  icon?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
}

export function PDFExportButton({
  onPress,
  label = "Export PDF",
  icon = "document-text",
  variant = "primary",
  size = "medium",
}: PDFExportButtonProps) {
  const colors = useColors();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);

      // Generate PDF
      const { buffer, filename } = await onPress();

      // Save to file system
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, buffer, {
        encoding: "base64",
      });

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/pdf",
          dialogTitle: `Share ${filename}`,
        });
      } else {
        Alert.alert("Success", `PDF saved to: ${fileUri}`);
      }
    } catch (error) {
      console.error("[PDF Export] Error:", error);
      Alert.alert("Error", "Failed to export PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const buttonStyles = {
    primary: {
      bg: colors.primary,
      text: "white",
      border: "transparent",
    },
    secondary: {
      bg: colors.surface,
      text: colors.foreground,
      border: "transparent",
    },
    outline: {
      bg: "transparent",
      text: colors.primary,
      border: colors.border,
    },
  };

  const sizeStyles = {
    small: { padding: 6, fontSize: 12, iconSize: 14 },
    medium: { padding: 10, fontSize: 14, iconSize: 18 },
    large: { padding: 14, fontSize: 16, iconSize: 20 },
  };

  const style = buttonStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={handleExport}
      disabled={isLoading}
      activeOpacity={0.7}
      style={{
        paddingHorizontal: sizeStyle.padding * 1.5,
        paddingVertical: sizeStyle.padding,
        borderRadius: 8,
        backgroundColor: style.bg,
        borderWidth: variant === "outline" ? 1 : 0,
        borderColor: style.border,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      <Ionicons
        name={isLoading ? "hourglass" : (icon as any)}
        size={sizeStyle.iconSize}
        color={style.text}
      />
      <Text
        style={{
          fontSize: sizeStyle.fontSize,
          fontWeight: "600",
          color: style.text,
        }}
      >
        {isLoading ? "Exporting..." : label}
      </Text>
    </TouchableOpacity>
  );
}
