import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import MainScreen from "../screens/MainScreen"
import AddTodoScreen from "../screens/AddTodoScreen"

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="AddTodo" component={AddTodoScreen} />
    </Stack.Navigator>
  )
}