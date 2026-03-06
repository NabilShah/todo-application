import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Todo } from "../types/todo"

interface TodoState {
    list: Todo[]
}

const initialState: TodoState = {
    list: []
}

// Redux slice responsible for managing todo state globally.
// Handles adding, updating, deleting and toggling todos.
const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        setTodos(state, action: PayloadAction<Todo[]>) {
            state.list = action.payload
        },

        addTodo(state, action: PayloadAction<Todo>) {
            state.list.unshift(action.payload)
        },

        toggleTodo(state, action: PayloadAction<string>) {
            const todo = state.list.find(t => t.id === action.payload)
            if (todo) {
                todo.completed = !todo.completed
                todo.updated_at = Date.now()
            }
        },

        deleteTodo(state, action: PayloadAction<string>) {
            state.list = state.list.filter(t => t.id !== action.payload)
        },

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