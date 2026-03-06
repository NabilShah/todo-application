import React, { useState, useCallback } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";
import { useDispatch } from "react-redux";
import { addTodo } from "../store/todoSlice";
import { createTodo } from "../hooks/useTodos";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTodoScreen({ navigation }: any) {

    const [title, setTitle] = useState("");
    const dispatch = useDispatch();

    // Creates a new todo item and stores it in Firestore.
    // After saving, the todo is added to Redux state
    // and the screen navigates back to the main list.
    const handleAddTodo = useCallback(async () => {
        
        // Prevent creating empty todos
        if (!title.trim()) return;

        const newTodo = {
            title,
            completed: false,
            created_at: Date.now(),
            updated_at: Date.now()
        };

        const savedTodo = await createTodo(newTodo as any);

        dispatch(addTodo(savedTodo));

        navigation.goBack();
    }, [title]);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
                Add Todo
            </Text>
        </View>
        <TextInput
            placeholder="Enter todo..."
            placeholderTextColor="#8f8f8f"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
        />

        <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTodo}
        >
            <Text style={styles.addButtonText}>
                Add Todo
            </Text>
        </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: theme.background,
        padding: 20
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30
    },

    backButton: {
        marginRight: 10
    },

    headerTitle: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "bold"
    },

    input: {
        backgroundColor: "#111",
        borderRadius: 8,
        padding: 12,
        color: "#fff",
        borderWidth: 1,
        borderColor: "#fff",
        marginBottom: 20
    },

    addButton: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 8,
        alignItems: "center"
    },

    addButtonText: {
        color: "#000",
        fontWeight: "bold"
    }

});