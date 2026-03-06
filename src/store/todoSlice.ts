import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Todo } from "../types/todo"

interface TodoState {
    list: Todo[]
}

// Initial state for the todo slice.
// The list will be populated when todos are fetched from Firestore.
const initialState: TodoState = {
    list: []
}

// Redux slice responsible for managing todo state globally.
// Handles adding, updating, deleting and toggling todos.
const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        // Replace the entire todo list in Redux state.
        // Used when loading todos from Firestore.
        setTodos(state, action: PayloadAction<Todo[]>) {
            state.list = action.payload
        },

        // Add a newly created todo to the beginning of the list.
        // unshift() ensures the most recent todo appears at the top.
        addTodo(state, action: PayloadAction<Todo>) {
            state.list.unshift(action.payload)
        },

        // Toggle completion status of a todo.
        // Also updates the timestamp to reflect the modification time.
        toggleTodo(state, action: PayloadAction<string>) {
            const todo = state.list.find(t => t.id === action.payload)
            if (todo) {
                todo.completed = !todo.completed
                todo.updated_at = Date.now()
            }
        },

        // Remove a todo from Redux state by filtering out its ID.
        deleteTodo(state, action: PayloadAction<string>) {
            state.list = state.list.filter(t => t.id !== action.payload)
        },

        // Update an existing todo in Redux state after editing.
        // The reducer replaces the old todo with the updated version.
        updateTodo(state, action: PayloadAction<Todo>) {
            const index = state.list.findIndex(t => t.id === action.payload.id)
            if (index !== -1) {
                state.list[index] = action.payload
            }
        }
    }
})

export const {
    setTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo
} = todoSlice.actions

export default todoSlice.reducer