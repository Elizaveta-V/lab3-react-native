import { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getRecipeById, deleteRecipe } from '../../db';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function PersonalRecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const r = getRecipeById(Number(id));
      setRecipe(r || null);
    }, [id])
  );

  function handleDelete() {
    Alert.alert('Delete Recipe', 'Are you sure you want to delete this recipe?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteRecipe(Number(id));
          router.back();
        },
      },
    ]);
  }

  if (!recipe) return (
    <View style={styles.center}>
      <Text style={styles.notFound}>Recipe not found.</Text>
    </View>
  );

  const ingredientLines = recipe.ingredients.split('\n').filter(l => l.trim());

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <FontAwesome name="image" size={60} color="#BDBDBD" />
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{recipe.name}</Text>

        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredientLines.length > 0 ? (
          ingredientLines.map((line, i) => (
            <View key={i} style={styles.ingredientRow}>
              <View style={styles.dot} />
              <Text style={styles.ingredientText}>{line.trim()}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.bodyText}>{recipe.ingredients}</Text>
        )}

        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.bodyText}>{recipe.instructions}</Text>

        <Pressable style={styles.editBtn} onPress={() => router.push(`/personal/edit/${id}`)}>
          <FontAwesome name="pencil" size={16} color="#fff" />
          <Text style={styles.editBtnText}>Edit Recipe</Text>
        </Pressable>

        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <FontAwesome name="trash" size={16} color="#fff" />
          <Text style={styles.deleteBtnText}>Delete Recipe</Text>
        </Pressable>
      </View>
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: {
    color: '#757575',
    fontSize: 15,
  },
  image: {
    width: '100%',
    height: 240,
  },
  imagePlaceholder: {
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 16,
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginTop: 12,
    marginBottom: 6,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E53935',
  },
  ingredientText: {
    fontSize: 14,
    color: '#424242',
  },
  bodyText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 22,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 24,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E53935',
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 10,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
