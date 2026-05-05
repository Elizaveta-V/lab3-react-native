import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(r => r.json())
      .then(data => {
        setMeal(data.meals?.[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 60 }} />;
  if (!meal) return <Text style={styles.error}>Recipe not found.</Text>;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(`${measure?.trim() || ''} ${ing.trim()}`.trim());
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{meal.strMeal}</Text>
      <Text style={styles.category}>{meal.strCategory} • {meal.strArea}</Text>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      <View style={styles.ingredientsList}>
        {ingredients.map((ing, i) => (
          <View key={i} style={styles.ingredientRow}>
            <View style={styles.dot} />
            <Text style={styles.ingredientText}>{ing}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{meal.strInstructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 260,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212121',
    margin: 16,
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: '#757575',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#212121',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  ingredientsList: {
    marginHorizontal: 16,
    gap: 6,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2196F3',
  },
  ingredientText: {
    fontSize: 14,
    color: '#424242',
  },
  instructions: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 22,
    marginHorizontal: 16,
    marginTop: 4,
  },
  error: {
    textAlign: 'center',
    marginTop: 60,
    color: '#757575',
  },
});
