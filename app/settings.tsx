import { ScrollView, Text, View, TouchableOpacity, Switch, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";

interface Setting {
  id: string;
  label: string;
  description: string;
  type: "toggle" | "select" | "input";
  value: any;
}

export default function SettingsScreen() {
  const colors = useColors();
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    autoSave: true,
    jarvisEnabled: true,
    defaultSources: ["GoogleScholar", "arXiv"],
  });

  const [showJarvisChat, setShowJarvisChat] = useState(false);
  const [jarvisMessages, setJarvisMessages] = useState<
    Array<{ role: "user" | "assistant"; text: string }>
  >([
    {
      role: "assistant",
      text: "Good day, sir/madam. I am JARVIS, your research assistant. How may I assist you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setJarvisMessages((prev) => [
        ...prev,
        { role: "user", text: chatInput },
        {
          role: "assistant",
          text: "Very good, sir/madam. I have noted your request. Allow me to process this information and provide you with the most relevant insights.",
        },
      ]);
      setChatInput("");
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 p-4">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-2xl font-bold text-foreground">Settings</Text>
            <Text className="text-sm text-muted">Customize your research experience</Text>
          </View>

          {/* JARVIS Assistant Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              🤖 JARVIS Assistant
            </Text>

            <TouchableOpacity
              onPress={() => setShowJarvisChat(!showJarvisChat)}
              className="p-4 rounded-lg gap-3"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1 gap-1">
                  <Text className="text-sm font-semibold text-foreground">
                    Chat with JARVIS
                  </Text>
                  <Text className="text-xs text-muted">
                    Get personalized research assistance
                  </Text>
                </View>
                <Ionicons
                  name={showJarvisChat ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>

            {/* JARVIS Chat */}
            {showJarvisChat && (
              <View
                className="p-4 rounded-lg gap-3 max-h-80"
                style={{ backgroundColor: colors.surface }}
              >
                <ScrollView className="gap-2 mb-2">
                  {jarvisMessages.map((msg, idx) => (
                    <View
                      key={idx}
                      className={`p-3 rounded-lg max-w-xs ${
                        msg.role === "user" ? "self-end" : "self-start"
                      }`}
                      style={{
                        backgroundColor:
                          msg.role === "user" ? colors.primary : colors.background,
                      }}
                    >
                      <Text
                        className="text-xs"
                        style={{
                          color:
                            msg.role === "user" ? "white" : colors.foreground,
                        }}
                      >
                        {msg.text}
                      </Text>
                    </View>
                  ))}
                </ScrollView>

                <View className="flex-row gap-2">
                  <TextInput
                    className="flex-1 border rounded-lg px-3 py-2 text-foreground"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    }}
                    placeholder="Ask JARVIS..."
                    placeholderTextColor={colors.muted}
                    value={chatInput}
                    onChangeText={setChatInput}
                  />
                  <TouchableOpacity
                    onPress={handleSendMessage}
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Ionicons name="send" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* JARVIS Toggle */}
            <View
              className="flex-row justify-between items-center p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-1 gap-1">
                <Text className="text-sm font-semibold text-foreground">
                  Enable JARVIS
                </Text>
                <Text className="text-xs text-muted">
                  Activate AI-powered assistance
                </Text>
              </View>
              <Switch
                value={settings.jarvisEnabled}
                onValueChange={() => handleToggle("jarvisEnabled")}
              />
            </View>
          </View>

          {/* Display Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Display</Text>

            <View
              className="flex-row justify-between items-center p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-1 gap-1">
                <Text className="text-sm font-semibold text-foreground">
                  Dark Mode
                </Text>
                <Text className="text-xs text-muted">
                  Easier on the eyes at night
                </Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={() => handleToggle("darkMode")}
              />
            </View>
          </View>

          {/* Research Settings */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Research</Text>

            <View
              className="flex-row justify-between items-center p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-1 gap-1">
                <Text className="text-sm font-semibold text-foreground">
                  Auto-Save Papers
                </Text>
                <Text className="text-xs text-muted">
                  Automatically save interesting papers
                </Text>
              </View>
              <Switch
                value={settings.autoSave}
                onValueChange={() => handleToggle("autoSave")}
              />
            </View>

            <View
              className="p-4 rounded-lg gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm font-semibold text-foreground">
                Default Search Sources
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {["GoogleScholar", "arXiv", "Web"].map((source) => (
                  <TouchableOpacity
                    key={source}
                    onPress={() => {
                      const newSources = settings.defaultSources.includes(source)
                        ? settings.defaultSources.filter((s) => s !== source)
                        : [...settings.defaultSources, source];
                      setSettings((prev) => ({
                        ...prev,
                        defaultSources: newSources,
                      }));
                    }}
                    className="px-3 py-2 rounded-full border"
                    style={{
                      borderColor: settings.defaultSources.includes(source)
                        ? colors.primary
                        : colors.border,
                      backgroundColor: settings.defaultSources.includes(source)
                        ? colors.primary
                        : colors.background,
                    }}
                  >
                    <Text
                      className="text-xs font-medium"
                      style={{
                        color: settings.defaultSources.includes(source)
                          ? "white"
                          : colors.foreground,
                      }}
                    >
                      {source}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Notifications
            </Text>

            <View
              className="flex-row justify-between items-center p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-1 gap-1">
                <Text className="text-sm font-semibold text-foreground">
                  Push Notifications
                </Text>
                <Text className="text-xs text-muted">
                  Get notified about new research
                </Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleToggle("notifications")}
              />
            </View>
          </View>

          {/* About Section */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">About</Text>

            <View
              className="p-4 rounded-lg gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">App Version</Text>
                <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">JARVIS Version</Text>
                <Text className="text-sm font-semibold text-foreground">
                  Elite 1.0
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="p-4 rounded-lg items-center border"
              style={{ borderColor: colors.border }}
            >
              <Text className="text-sm font-semibold text-primary">
                View Documentation
              </Text>
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity
            className="p-4 rounded-lg items-center mb-4"
            style={{ backgroundColor: colors.error }}
          >
            <Text className="text-sm font-semibold text-white">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
