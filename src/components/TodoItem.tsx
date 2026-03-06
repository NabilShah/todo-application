import React, { useState } from "react";
import { Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { Todo } from "../types/todo";
import { toggleTodo, deleteTodo, updateTodo } from "../store/todoSlice";
import { editTodo, removeTodo } from "../hooks/useTodos";

interface Props {
    todo: Todo;
}

// TodoItem represents a single todo in the list.
// React.memo prevents unnecessary re-renders when the todo
// data has not changed, improving list performance.
const TodoItem = React.memo(({ todo }: Props) => {

    const dispatch = useDispatch();
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(todo.title);

    // Toggle completion state of a todo
    // Updates both Firestore and Redux state
    const handleToggle = async () => {

        const updated = {
            ...todo,
            completed: !todo.completed,
            updated_at: Date.now()
        };

        await editTodo(updated);

        dispatch(toggleTodo(todo.id));
    };

    // Remove todo from Firestore and Redux store
    const handleDelete = async () => {

        await removeTodo(todo.id);

        dispatch(deleteTodo(todo.id));
    };

    // Update todo title and timestamp when editing
    const handleEdit = async () => {

        if (!text.trim()) return;

        const updated = {
            ...todo,
            title: text,
            updated_at: Date.now()
        };

        await editTodo(updated);

        dispatch(updateTodo(updated));

        setEditing(false);
    };

    return (
    <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        layout={Layout.springify()}
        style={styles.container}
    >

        {/* Toggle */}
        <TouchableOpacity onPress={handleToggle}>
            <Text style={styles.checkbox}>
                {todo.completed ? "☑" : "☐"}
            </Text>
        </TouchableOpacity>

        {/* Title / Edit */}
        {editing ? (
            <TextInput
                value={text}
                onChangeText={setText}
                style={styles.input}
            />
        ) : (
            <Text
                style={[
                    styles.title,
                    todo.completed && styles.completed
                ]}
            >
                {todo.title}
            </Text>
        )}

        {/* Edit Button */}
        <TouchableOpacity onPress={() => editing ? handleEdit() : setEditing(true)}>
            <Text style={styles.button}>
                {editing ? "Save" : "Edit"}
            </Text>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.delete}>
                Delete
            </Text>
        </TouchableOpacity>

    </Animated.View>
);
});

export default TodoItem;

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        marginVertical: 6,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2
    },

    checkbox: {
        fontSize: 22,
        marginRight: 12
    },

    title: {
        flex: 1,
        fontSize: 16,
        color: "#111"
    },

    completed: {
        textDecorationLine: "line-through",
        color: "#888"
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 6,
        borderRadius: 6
    },

    button: {
        marginHorizontal: 8,
        color: "#007AFF",
        fontWeight: "500"
    },

    delete: {
        color: "#ff3b30",
        fontWeight: "500"
    }

});