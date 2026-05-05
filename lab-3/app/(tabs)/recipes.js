import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Image, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { initDatabase } from '../../db';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const CATEGORY = 'Seafood';

export default function RecipesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDatabase();
    fetchByCategory();
  }, []);

  async function fetchByCategory() {
    setLoading(true);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${CATEGORY}`);
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch (_) {
      setRecipes([]);
    }
    setLoading(false);
  }

  async function search() {
    if (!query.trim()) {
      fetchByCategory();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch (_) {
      setRecipes([]);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          placeholderTextColor="#9E9E9E"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={search}
          returnKeyType="search"
        />
        <Pressable style={styles.searchBtn} onPress={search}>
          <FontAwesome name="search" size={18} color="#fff" />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No recipes found.</Text>}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push(`/recipe/${item.idMeal}`)}>
              <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
              <Text style={styles.cardTitle} numberOfLines={2}>{item.strMeal}</Text>
            </Pressable>
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchRow: {
    flexDirection: 'row',
    margin: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#212121',
  },
  searchBtn: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 8,
    paddingBottom: 24,
  },
  row: {
    gap: 8,
    marginBottom: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  thumb: {
    width: '100%',
    height: 120,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
    padding: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    color: '#757575',
    fontSize: 15,
  },
});
