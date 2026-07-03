import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/use-auth";

interface RecentSearch {
  id: string;
  query: string;
  timestamp: Date;
}

export default function HomeScreen() {
  const colors = useColors();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    {
      id: "1",
      query: "Machine Learning Applications",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      query: "Quantum Computing",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: "3",
      query: "Climate Change Research",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        query: searchQuery,
        timestamp: new Date(),
      };
      setRecentSearches([newSearch, ...recentSearches.slice(0, 4)]);
      setSearchQuery("");
      // Navigate to search results
    }
  };

  const handleVoiceSearch = () => {
    // Voice search implementation will go here
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-6 p-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Research Partner
            </Text>
            <Text className="text-sm text-muted">
              {isAuthenticated ? `Welcome, ${user?.name || "Researcher"}` : "Sign in to get started"}
            </Text>
          </View>

          {/* Quick Search Bar */}
          <View className="gap-3">
            <View
              className="flex-row items-center gap-3 rounded-xl px-4 py-3 border"
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              <Ionicons name="search" size={20} color={colors.muted} />
              <TextInput
                className="flex-1 text-foreground"
                placeholder="Search papers..."
                placeholderTextColor={colors.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity
                onPress={handleVoiceSearch}
                style={{ opacity: 0.7 }}
                activeOpacity={0.5}
              >
                <Ionicons name="mic" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-muted px-1">
              Tap the microphone to search by voice
            </Text>
          </View>

          {/* Dashboard Stats */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Your Research
            </Text>
            <View className="flex-row gap-3">
              <View
                className="flex-1 rounded-lg p-4 gap-2"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-2xl font-bold text-primary">12</Text>
                <Text className="text-xs text-muted">Papers Saved</Text>
              </View>
              <View
                className="flex-1 rounded-lg p-4 gap-2"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-2xl font-bold text-primary">3</Text>
                <Text className="text-xs text-muted">Collections</Text>
              </View>
              <View
                className="flex-1 rounded-lg p-4 gap-2"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-2xl font-bold text-primary">5</Text>
                <Text className="text-xs text-muted">Analyses</Text>
              </View>
            </View>
          </View>

          {/* Recent Searches */}
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-foreground">
                Recent Searches
              </Text>
              <TouchableOpacity>
                <Text className="text-sm text-primary">View All</Text>
              </TouchableOpacity>
            </View>

            {recentSearches.length > 0 ? (
              <FlatList
                scrollEnabled={false}
                data={recentSearches}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex-row items-center justify-between rounded-lg p-3 mb-2"
                    style={{ backgroundColor: colors.surface }}
                    activeOpacity={0.7}
                  >
                    <View className="flex-1 gap-1">
                      <Text className="text-sm font-medium text-foreground">
                        {item.query}
                      </Text>
                      <Text className="text-xs text-muted">
                        {formatTime(item.timestamp)}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.muted}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text className="text-sm text-muted text-center py-4">
                No recent searches
              </Text>
            )}
          </View>

          {/* Quick Actions */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Quick Actions
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 rounded-lg p-4 items-center gap-2"
                style={{ backgroundColor: colors.primary }}
                activeOpacity={0.8}
              >
                <Ionicons name="add-circle" size={24} color="white" />
                <Text className="text-sm font-medium text-white">New Search</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-lg p-4 items-center gap-2"
                style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
                activeOpacity={0.8}
              >
                <Ionicons name="bookmark" size={24} color={colors.primary} />
                <Text className="text-sm font-medium text-foreground">Saved</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
