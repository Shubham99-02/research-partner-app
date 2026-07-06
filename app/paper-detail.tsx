import { ScrollView, Text, View, TouchableOpacity, Linking, FlatList } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";

interface PaperDetail {
  id: number;
  title: string;
  authors: string[];
  abstract: string;
  source: string;
  url: string;
  doi?: string;
  publicationDate?: string;
  keywords?: string[];
  citations?: number;
  relevanceScore: number;
}

interface TabItem {
  id: string;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { id: "overview", label: "Overview", icon: "document" },
  { id: "insights", label: "Insights", icon: "bulb" },
  { id: "citations", label: "Citations", icon: "link" },
  { id: "actions", label: "Actions", icon: "share-social" },
];

// Mock paper data
const mockPaper: PaperDetail = {
  id: 1,
  title: "Deep Learning Applications in Computer Vision: A Comprehensive Review",
  authors: ["John Doe", "Jane Smith", "Robert Johnson"],
  abstract:
    "This comprehensive review explores the latest applications of deep learning in computer vision tasks, including object detection, semantic segmentation, and image classification. We analyze state-of-the-art architectures, discuss challenges, and propose future research directions.",
  source: "GoogleScholar",
  url: "https://example.com/paper",
  doi: "10.1234/example.2024",
  publicationDate: "2024-01-15",
  keywords: ["Deep Learning", "Computer Vision", "Neural Networks", "CNN"],
  citations: 245,
  relevanceScore: 95,
};

export default function PaperDetailScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaved, setIsSaved] = useState(false);
  const paper = mockPaper;

  const handleOpenURL = () => {
    if (paper.url) {
      Linking.openURL(paper.url);
    }
  };

  const handleOpenDOI = () => {
    if (paper.doi) {
      Linking.openURL(`https://doi.org/${paper.doi}`);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-4">
          {/* Header with Score */}
          <View className="px-4 pt-4 pb-2 gap-3">
            <View className="flex-row justify-between items-start gap-2">
              <View className="flex-1 gap-2">
                <Text className="text-xl font-bold text-foreground">
                  {paper.title}
                </Text>
                <Text className="text-sm text-muted">
                  {paper.authors.join(", ")}
                </Text>
              </View>
              <View
                className="px-3 py-2 rounded-lg items-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-white font-bold text-lg">
                  {paper.relevanceScore}%
                </Text>
                <Text className="text-xs text-white">Match</Text>
              </View>
            </View>

            {/* Meta Info */}
            <View className="flex-row flex-wrap gap-2">
              <View
                className="px-3 py-2 rounded-full flex-row items-center gap-1"
                style={{ backgroundColor: colors.surface }}
              >
                <Ionicons name="calendar" size={14} color={colors.muted} />
                <Text className="text-xs text-muted">
                  {paper.publicationDate}
                </Text>
              </View>
              <View
                className="px-3 py-2 rounded-full flex-row items-center gap-1"
                style={{ backgroundColor: colors.surface }}
              >
                <Ionicons name="bookmark" size={14} color={colors.muted} />
                <Text className="text-xs text-muted">{paper.source}</Text>
              </View>
              {paper.citations && (
                <View
                  className="px-3 py-2 rounded-full flex-row items-center gap-1"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Ionicons name="link" size={14} color={colors.muted} />
                  <Text className="text-xs text-muted">
                    {paper.citations} citations
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Tab Navigation */}
          <View
            className="flex-row border-b"
            style={{ borderColor: colors.border }}
          >
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className="flex-1 py-3 px-2 items-center flex-row justify-center gap-1"
                style={{
                  borderBottomWidth: activeTab === tab.id ? 2 : 0,
                  borderBottomColor: colors.primary,
                }}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={18}
                  color={
                    activeTab === tab.id ? colors.primary : colors.muted
                  }
                />
                <Text
                  className="text-xs font-medium"
                  style={{
                    color: activeTab === tab.id ? colors.primary : colors.muted,
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View className="px-4 pb-4">
            {activeTab === "overview" && (
              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    Abstract
                  </Text>
                  <Text className="text-sm text-muted leading-relaxed">
                    {paper.abstract}
                  </Text>
                </View>

                {paper.keywords && paper.keywords.length > 0 && (
                  <View className="gap-2">
                    <Text className="text-sm font-semibold text-foreground">
                      Keywords
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {paper.keywords.map((keyword, idx) => (
                        <View
                          key={idx}
                          className="px-3 py-1 rounded-full"
                          style={{ backgroundColor: colors.surface }}
                        >
                          <Text className="text-xs text-foreground">
                            {keyword}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    Publication Details
                  </Text>
                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Source:</Text>
                      <Text className="text-xs text-foreground font-medium">
                        {paper.source}
                      </Text>
                    </View>
                    {paper.doi && (
                      <View className="flex-row justify-between">
                        <Text className="text-xs text-muted">DOI:</Text>
                        <Text className="text-xs text-primary font-medium">
                          {paper.doi}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}

            {activeTab === "insights" && (
              <View className="gap-3">
                <View
                  className="p-3 rounded-lg gap-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text className="text-sm font-semibold text-foreground">
                    🤖 JARVIS Analysis
                  </Text>
                  <Text className="text-xs text-muted leading-relaxed">
                    This paper presents significant advances in CNN architectures
                    for real-time object detection. The key contribution lies in
                    the novel attention mechanism that improves accuracy by 12%.
                  </Text>
                </View>

                <View
                  className="p-3 rounded-lg gap-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text className="text-sm font-semibold text-foreground">
                    Key Findings
                  </Text>
                  <Text className="text-xs text-muted">
                    • Proposes a new attention-based CNN architecture{"\n"}•
                    Achieves 92% accuracy on benchmark datasets{"\n"}•
                    Reduces inference time by 40% compared to previous methods
                  </Text>
                </View>

                <View
                  className="p-3 rounded-lg gap-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text className="text-sm font-semibold text-foreground">
                    Research Gaps
                  </Text>
                  <Text className="text-xs text-muted">
                    • Limited evaluation on edge devices{"\n"}•
                    Scalability to larger datasets not tested{"\n"}•
                    Comparison with recent transformer-based approaches missing
                  </Text>
                </View>
              </View>
            )}

            {activeTab === "citations" && (
              <View className="gap-3">
                <View
                  className="p-3 rounded-lg gap-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text className="text-sm font-semibold text-foreground">
                    Citation Count
                  </Text>
                  <Text className="text-2xl font-bold text-primary">
                    {paper.citations}
                  </Text>
                  <Text className="text-xs text-muted">
                    Citations in academic literature
                  </Text>
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    BibTeX
                  </Text>
                  <View
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <Text className="text-xs font-mono text-muted">
                      @article{"{"}doe2024deep,{"\n"}
                      {"  "}title={"{"}Deep Learning Applications...{"}"},
                      {"\n"}
                      {"  "}author={"{"}Doe, John and Smith, Jane{"}"},
                      {"\n"}
                      {"  "}year={"{"}2024{"}"},
                      {"\n"}
                      {"}"}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === "actions" && (
              <View className="gap-3">
                <TouchableOpacity
                  onPress={handleOpenURL}
                  className="flex-row items-center justify-between p-4 rounded-lg border"
                  style={{ borderColor: colors.border }}
                >
                  <View className="flex-row items-center gap-3">
                    <Ionicons name="open" size={20} color={colors.primary} />
                    <Text className="text-sm font-medium text-foreground">
                      Open Paper
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.muted}
                  />
                </TouchableOpacity>

                {paper.doi && (
                  <TouchableOpacity
                    onPress={handleOpenDOI}
                    className="flex-row items-center justify-between p-4 rounded-lg border"
                    style={{ borderColor: colors.border }}
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons name="link" size={20} color={colors.primary} />
                      <Text className="text-sm font-medium text-foreground">
                        View on DOI
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.muted}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => setIsSaved(!isSaved)}
                  className="flex-row items-center justify-between p-4 rounded-lg"
                  style={{
                    backgroundColor: isSaved ? colors.primary : colors.surface,
                  }}
                >
                  <View className="flex-row items-center gap-3">
                    <Ionicons
                      name={isSaved ? "bookmark" : "bookmark-outline"}
                      size={20}
                      color={isSaved ? "white" : colors.primary}
                    />
                    <Text
                      className="text-sm font-medium"
                      style={{
                        color: isSaved ? "white" : colors.foreground,
                      }}
                    >
                      {isSaved ? "Saved to Collection" : "Save Paper"}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 rounded-lg border"
                  style={{ borderColor: colors.border }}
                >
                  <View className="flex-row items-center gap-3">
                    <Ionicons name="share-social" size={20} color={colors.primary} />
                    <Text className="text-sm font-medium text-foreground">
                      Share Paper
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.muted}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
