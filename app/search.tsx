import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";
import { trpc } from "@/lib/trpc";

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  source: string;
  url: string;
  relevanceScore: number;
  publicationDate?: string;
}

export default function SearchScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([
    "GoogleScholar",
    "arXiv",
    "Web",
  ]);
  const [results, setResults] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const sources = [
    { id: "GoogleScholar", label: "Google Scholar", icon: "school" },
    { id: "arXiv", label: "arXiv", icon: "document" },
    { id: "Web", label: "Web", icon: "globe" },
  ];

  const toggleSource = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((s) => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || selectedSources.length === 0) return;

    setIsLoading(true);
    try {
      // Call tRPC search endpoint
      // const response = await trpc.research.search.mutate({
      //   query: searchQuery,
      //   sources: selectedSources,
      //   limit: 20,
      // });
      // setResults(response.results);

      // Mock results for now
      setResults([
        {
          id: "1",
          title: "Deep Learning Applications in Computer Vision",
          authors: ["John Doe", "Jane Smith"],
          abstract:
            "This paper explores the latest applications of deep learning in computer vision tasks...",
          source: "GoogleScholar",
          url: "https://example.com/paper1",
          relevanceScore: 95,
          publicationDate: "2024-01-15",
        },
        {
          id: "2",
          title: "Quantum Computing: Theory and Practice",
          authors: ["Alice Johnson"],
          abstract:
            "A comprehensive review of quantum computing principles and practical implementations...",
          source: "arXiv",
          url: "https://example.com/paper2",
          relevanceScore: 87,
          publicationDate: "2024-02-20",
        },
      ]);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-4 p-4">
          {/* Header */}
          <Text className="text-2xl font-bold text-foreground">Search</Text>

          {/* Search Input */}
          <View
            className="flex-row items-center gap-2 rounded-lg px-4 py-3 border"
            style={{ borderColor: colors.border, backgroundColor: colors.surface }}
          >
            <Ionicons name="search" size={20} color={colors.muted} />
            <TextInput
              className="flex-1 text-foreground text-base"
              placeholder="Enter research query..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="mic" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Source Selection */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              Search Sources
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {sources.map((source) => (
                <TouchableOpacity
                  key={source.id}
                  onPress={() => toggleSource(source.id)}
                  className="flex-row items-center gap-2 px-3 py-2 rounded-full border"
                  style={{
                    borderColor: selectedSources.includes(source.id)
                      ? colors.primary
                      : colors.border,
                    backgroundColor: selectedSources.includes(source.id)
                      ? colors.primary
                      : colors.surface,
                  }}
                >
                  <Ionicons
                    name={source.icon as any}
                    size={16}
                    color={
                      selectedSources.includes(source.id)
                        ? "white"
                        : colors.foreground
                    }
                  />
                  <Text
                    className="text-sm font-medium"
                    style={{
                      color: selectedSources.includes(source.id)
                        ? "white"
                        : colors.foreground,
                    }}
                  >
                    {source.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Filters Toggle */}
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="flex-row items-center justify-between px-3 py-2"
          >
            <Text className="text-sm font-medium text-foreground">
              Advanced Filters
            </Text>
            <Ionicons
              name={showFilters ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.muted}
            />
          </TouchableOpacity>

          {/* Filters (Collapsed) */}
          {showFilters && (
            <View className="gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.surface }}>
              <Text className="text-xs text-muted">
                Filter options would appear here (date range, domain, paper type)
              </Text>
            </View>
          )}

          {/* Search Button */}
          <TouchableOpacity
            onPress={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="rounded-lg py-3 items-center"
            style={{
              backgroundColor: colors.primary,
              opacity: isLoading || !searchQuery.trim() ? 0.5 : 1,
            }}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">Search Papers</Text>
            )}
          </TouchableOpacity>

          {/* Results */}
          {results.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">
                Results ({results.length})
              </Text>
              <FlatList
                scrollEnabled={false}
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="rounded-lg p-4 gap-2 mb-3"
                    style={{ backgroundColor: colors.surface }}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row justify-between items-start gap-2">
                      <Text className="flex-1 text-sm font-semibold text-foreground">
                        {item.title}
                      </Text>
                      <View
                        className="px-2 py-1 rounded"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <Text className="text-xs font-bold text-white">
                          {item.relevanceScore}%
                        </Text>
                      </View>
                    </View>
                    <Text className="text-xs text-muted">
                      {item.authors.join(", ")}
                    </Text>
                    <Text className="text-xs text-muted">
                      {item.source} • {item.publicationDate}
                    </Text>
                    <Text className="text-xs text-foreground leading-relaxed">
                      {item.abstract.substring(0, 100)}...
                    </Text>
                    <View className="flex-row gap-2 mt-2">
                      <TouchableOpacity
                        className="flex-1 py-2 rounded items-center"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <Text className="text-xs font-medium text-white">
                          Save
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 py-2 rounded items-center border"
                        style={{ borderColor: colors.border }}
                      >
                        <Text className="text-xs font-medium text-foreground">
                          View
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {!isLoading && results.length === 0 && searchQuery && (
            <View className="items-center py-8 gap-2">
              <Ionicons name="search" size={48} color={colors.muted} />
              <Text className="text-sm text-muted">
                No results found. Try a different query.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
