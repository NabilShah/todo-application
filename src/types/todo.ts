//Todo Interface
//Defines the structure of a Todo object used throughout the application including Redux state, Firestore data, and UI components.
export interface Todo {
    id: string
    title: string
    completed: boolean
    created_at: number
    updated_at: number
}