import { ScrollView, Text, View, TouchableOpacity, FlatList, Modal, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Ionicons } from "@expo/vector-icons";

interface Collection {
  id: number;
  name: string;
  description?: string;
  color: string;
  paperCount: number;
  isDefault: boolean;
}

interface Paper {
  id: number;
  title: string;
  authors: string[];
  source: string;
  relevanceScore: number;
}

const mockCollections: Collection[] = [
  {
    id: 1,
    name: "Machine Learning",
    description: "Papers on ML algorithms and applications",
    color: "#0a7ea4",
    paperCount: 12,
    isDefault: false,
  },
  {
    id: 2,
    name: "Computer Vision",
    description: "Research on image processing and vision",
    color: "#22c55e",
    paperCount: 8,
    isDefault: false,
  },
  {
    id: 3,
    name: "Quantum Computing",
    description: "Quantum algorithms and hardware",
    color: "#f59e0b",
    paperCount: 5,
    isDefault: false,
  },
];

const mockPapers: Paper[] = [
  {
    id: 1,
    title: "Deep Learning Applications in Computer Vision",
    authors: ["John Doe", "Jane Smith"],
    source: "GoogleScholar",
    relevanceScore: 95,
  },
  {
    id: 2,
    title: "Neural Networks for Image Classification",
    authors: ["Robert Johnson"],
    source: "arXiv",
    relevanceScore: 88,
  },
];

export default function SavedScreen() {
  const colors = useColors();
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [viewMode, setViewMode] = useState<"collections" | "papers">("collections");

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: Math.max(...collections.map((c) => c.id), 0) + 1,
        name: newCollectionName,
        color: "#0a7ea4",
        paperCount: 0,
        isDefault: false,
      };
      setCollections([...collections, newCollection]);
      setNewCollectionName("");
      setShowModal(false);
    }
  };

  const handleSelectCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setViewMode("papers");
  };

  const handleDeleteCollection = (id: number) => {
    setCollections(collections.filter((c) => c.id !== id));
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="gap-4 p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-foreground">
                {viewMode === "collections" ? "Collections" : selectedCollection?.name}
              </Text>
              <Text className="text-sm text-muted">
                {viewMode === "collections"
                  ? `${collections.length} collections`
                  : `${mockPapers.length} papers`}
              </Text>
            </View>
            {viewMode === "papers" && (
              <TouchableOpacity
                onPress={() => setViewMode("collections")}
                className="p-2"
              >
                <Ionicons name="chevron-back" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Collections View */}
          {viewMode === "collections" && (
            <>
              {/* Create Collection Button */}
              <TouchableOpacity
                onPress={() => setShowModal(true)}
                className="flex-row items-center gap-3 p-4 rounded-lg border-2"
                style={{
                  borderColor: colors.primary,
                  borderStyle: "dashed",
                }}
              >
                <Ionicons name="add-circle" size={24} color={colors.primary} />
                <Text className="text-sm font-semibold text-primary">
                  Create New Collection
                </Text>
              </TouchableOpacity>

              {/* Collections Grid */}
              <FlatList
                scrollEnabled={false}
                data={collections}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ gap: 12 }}
                renderItem={({ item }) => (
                  <View className="flex-1">
                    <TouchableOpacity
                      onPress={() => handleSelectCollection(item)}
                      className="rounded-lg p-4 gap-3"
                      style={{ backgroundColor: item.color }}
                      activeOpacity={0.8}
                    >
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 gap-1">
                          <Text className="text-sm font-bold text-white">
                            {item.name}
                          </Text>
                          <Text className="text-xs text-white opacity-80">
                            {item.paperCount} papers
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDeleteCollection(item.id)}
                          className="p-1"
                        >
                          <Ionicons name="close-circle" size={20} color="white" />
                        </TouchableOpacity>
                      </View>
                      {item.description && (
                        <Text className="text-xs text-white opacity-70">
                          {item.description}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />

              {/* Empty State */}
              {collections.length === 0 && (
                <View className="items-center py-12 gap-3">
                  <Ionicons name="folder-open" size={48} color={colors.muted} />
                  <Text className="text-sm text-muted">No collections yet</Text>
                  <Text className="text-xs text-muted text-center">
                    Create your first collection to organize your research papers
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Papers View */}
          {viewMode === "papers" && selectedCollection && (
            <View className="gap-3">
              {/* Collection Info */}
              <View
                className="p-4 rounded-lg gap-2"
                style={{ backgroundColor: selectedCollection.color }}
              >
                <Text className="text-sm font-semibold text-white">
                  {selectedCollection.name}
                </Text>
                <Text className="text-xs text-white opacity-80">
                  {mockPapers.length} papers
                </Text>
              </View>

              {/* Papers List */}
              <FlatList
                scrollEnabled={false}
                data={mockPapers}
                keyExtractor={(item) => item.id.toString()}
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
                    <View className="flex-row justify-between items-center mt-2">
                      <Text className="text-xs text-muted">{item.source}</Text>
                      <TouchableOpacity className="p-1">
                        <Ionicons
                          name="trash"
                          size={16}
                          color={colors.error}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />

              {/* Export Options */}
              <View className="gap-2 mt-4">
                <Text className="text-sm font-semibold text-foreground">
                  Export Collection
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="flex-1 py-2 rounded items-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-xs font-medium text-white">BibTeX</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 py-2 rounded items-center border"
                    style={{ borderColor: colors.border }}
                  >
                    <Text className="text-xs font-medium text-foreground">RIS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 py-2 rounded items-center border"
                    style={{ borderColor: colors.border }}
                  >
                    <Text className="text-xs font-medium text-foreground">CSV</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create Collection Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            className="rounded-t-2xl p-6 gap-4"
            style={{ backgroundColor: colors.background }}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold text-foreground">
                New Collection
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            <TextInput
              className="border rounded-lg px-4 py-3 text-foreground"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
              placeholder="Collection name"
              placeholderTextColor={colors.muted}
              value={newCollectionName}
              onChangeText={setNewCollectionName}
            />

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="flex-1 py-3 rounded-lg items-center border"
                style={{ borderColor: colors.border }}
              >
                <Text className="text-sm font-semibold text-foreground">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateCollection}
                className="flex-1 py-3 rounded-lg items-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-sm font-semibold text-white">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
