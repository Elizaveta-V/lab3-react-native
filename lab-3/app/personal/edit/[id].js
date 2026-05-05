import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getRecipeById, updateRecipe } from '../../../db';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function EditRecipeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const recipe = getRecipeById(Number(id));
    if (recipe) {
      setName(recipe.name);
      setIngredients(recipe.ingredients);
      setInstructions(recipe.instructions);
      setImageUrl(recipe.image || '');
    }
  }, [id]);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageUrl('');
    }
  }

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Recipe name is required';
    if (!ingredients.trim()) e.ingredients = 'Ingredients are required';
    if (!instructions.trim()) e.instructions = 'Instructions are required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleUpdate() {
    if (!validate()) return;
    const finalImage = imageUri || imageUrl.trim();
    try {
      updateRecipe(Number(id), name.trim(), ingredients.trim(), instructions.trim(), finalImage);
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Could not update recipe.');
    }
  }

  const previewImage = imageUri || imageUrl.trim();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Field label="Recipe Name *" error={errors.name}>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={v => { setName(v); setErrors(p => ({ ...p, name: '' })); }}
          placeholder="e.g. Spaghetti Carbonara"
          placeholderTextColor="#9E9E9E"
        />
      </Field>

      <Field label="Ingredients *" error={errors.ingredients}>
        <TextInput
          style={[styles.input, styles.multiline, errors.ingredients && styles.inputError]}
          value={ingredients}
          onChangeText={v => { setIngredients(v); setErrors(p => ({ ...p, ingredients: '' })); }}
          placeholder="e.g. 200g pasta, 2 eggs..."
          placeholderTextColor="#9E9E9E"
          multiline
          numberOfLines={3}
        />
      </Field>

      <Field label="Instructions *" error={errors.instructions}>
        <TextInput
          style={[styles.input, styles.multiline, errors.instructions && styles.inputError]}
          value={instructions}
          onChangeText={v => { setInstructions(v); setErrors(p => ({ ...p, instructions: '' })); }}
          placeholder="Step by step instructions..."
          placeholderTextColor="#9E9E9E"
          multiline
          numberOfLines={5}
        />
      </Field>

      <Text style={styles.label}>Image</Text>
      <View style={styles.imageRow}>
        <Pressable style={styles.galleryBtn} onPress={pickImage}>
          <FontAwesome name="photo" size={16} color="#2196F3" />
          <Text style={styles.galleryBtnText}>Gallery</Text>
        </Pressable>
        <Text style={styles.orText}>or</Text>
        <TextInput
          style={[styles.input, styles.urlInput]}
          value={imageUrl}
          onChangeText={v => { setImageUrl(v); setImageUri(''); }}
          placeholder="Paste image URL"
          placeholderTextColor="#9E9E9E"
          autoCapitalize="none"
        />
      </View>

      {previewImage ? (
        <Image source={{ uri: previewImage }} style={styles.preview} resizeMode="cover" />
      ) : null}

      <Pressable style={styles.saveBtn} onPress={handleUpdate}>
        <Text style={styles.saveBtnText}>Update Recipe</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({ label, error, children }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 40, gap: 4 },
  fieldContainer: { marginBottom: 12, gap: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#424242', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#212121',
    backgroundColor: '#FAFAFA',
  },
  inputError: { borderColor: '#E53935' },
  multiline: { textAlignVertical: 'top', minHeight: 80 },
  errorText: { fontSize: 12, color: '#E53935', marginTop: 2 },
  imageRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  galleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#E3F2FD',
  },
  galleryBtnText: { color: '#2196F3', fontWeight: '600', fontSize: 14 },
  orText: { color: '#9E9E9E', fontSize: 13 },
  urlInput: { flex: 1 },
  preview: { width: '100%', height: 200, borderRadius: 10, marginBottom: 16 },
  saveBtn: { backgroundColor: '#2196F3', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
