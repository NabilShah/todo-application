//This file contains helper functions for interacting with
//the Firebase Firestore database. It handles CRUD operations
//(Create, Read, Update, Delete) for todo documents.
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../services/firebase"
import { Todo } from "../types/todo"

// Reference to the "todos" collection in Firestore database
const todosRef = collection(db, "todos")

// Fetch all todo documents from Firestore.
// Each document snapshot is mapped to a Todo object
// including the Firestore-generated document ID.
export const fetchTodos = async () => {
    const snapshot = await getDocs(todosRef)

    // Convert Firestore document snapshot into Todo object
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Todo[]
}

// Create a new todo document in Firestore.
// Firestore generates a unique document ID which is returned
// and merged with the todo data before sending back to the UI.
export const createTodo = async (todo: Todo) => {
    const docRef = await addDoc(todosRef, todo);

    return {
        ...todo,
        id: docRef.id
    };
}

// Delete a todo document from Firestore using its document ID
export const removeTodo = async (id: string) => {
    await deleteDoc(doc(db, "todos", id))
}

// Update an existing todo document in Firestore.
// Only the title, completion status, and updated timestamp are modified.
export const editTodo = async (todo: Todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
        title: todo.title,
        completed: todo.completed,
        updated_at: Date.now()
    })
}