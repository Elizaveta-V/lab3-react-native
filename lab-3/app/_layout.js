import { Stack } from "expo-router";

export default function RootLayoutNav() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="recipe/[id]" options={{ title: 'Recipe Details', headerBackTitle: 'Back' }} />
            <Stack.Screen name="personal/[id]" options={{ title: 'My Recipe', headerBackTitle: 'Back' }} />
            <Stack.Screen name="personal/add" options={{ title: 'Add Recipe', headerBackTitle: 'Back' }} />
            <Stack.Screen name="personal/edit/[id]" options={{ title: 'Edit Recipe', headerBackTitle: 'Back' }} />
        </Stack>
    );
}
