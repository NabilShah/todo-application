import React, { useState, useEffect, useMemo, useCallback } from "react"
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store/store"
import { setTodos } from "../store/todoSlice"
import { fetchTodos, createTodo } from "../hooks/useTodos"
import { fetchApiTodos } from "../services/api";
import { theme } from "../theme/theme";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import TodoItem from "../components/TodoItem";

export default function MainScreen({ navigation }: any) {
    const [filter, setFilter] = useState<"all" | "active" | "done">("all");
    // Controls how many todos are rendered initially.
    // Used for implementing infinite scroll to improve performance.
    const [visibleCount, setVisibleCount] = useState(10);
    const dispatch = useDispatch();
    const [sortField, setSortField] = useState<"recent" | "id">("recent");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [loadingMore, setLoadingMore] = useState(false);
    const todos = useSelector((state: RootState) => state.todos.list)
    const filterOptions = [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Done", value: "done" }
    ];
    useEffect(() => {
        loadTodos()
    }, []);

    useEffect(() => {
        setVisibleCount(10);
    }, [filter, sortField, sortOrder]);

    // Load todos from Firestore.
    // If the database is empty on first app launch,
    // fetch initial todos from the public API and store them in Firestore.
    const loadTodos = async () => {
        let data = await fetchTodos();

        if (data.length === 0) {

            const apiTodos = await fetchApiTodos();

            // Insert all API todos into Firestore in parallel
            // Promise.all improves performance compared to inserting one-by-one
            await Promise.all(
                apiTodos.map(todo =>
                    createTodo({
                    title: todo.title,
                    completed: todo.completed,
                    created_at: Date.now(),
                    updated_at: Date.now()
                    } as any)
                )
            );

            data = await fetchTodos();
        }
        // Store the fetched todos in Redux global state
        // so they can be accessed across the application
        dispatch(setTodos(data))
    }

    // Loads additional todos when the user scrolls near the end of the list.
    // This simulates infinite scrolling by gradually increasing visible items.
    const loadMoreTodos = () => {

        // Prevent loading more if all todos are already visible
        if (visibleCount >= sortedTodos.length) return;

        setLoadingMore(true);

        setTimeout(() => {
            setVisibleCount(prev => prev + 10);
            setLoadingMore(false);
        }, 400);

    };

    // Memoized computation for filtering and sorting todos.
    // useMemo prevents unnecessary recalculations on every render
    // and only recomputes when dependencies change.
    const sortedTodos = useMemo(() => {

        const filtered = todos.filter(todo => {

            if (filter === "active") return !todo.completed;
            if (filter === "done") return todo.completed;

            return true;

        });

        // Sort todos based on selected field and order.
        // - "recent" sorts by updated timestamp
        // - "id" sorts alphabetically by id
        // sortOrder determines ascending or descending order
        return [...filtered].sort((a, b) => {

            let result = 0;

            if (sortField === "recent") {
                result = a.updated_at - b.updated_at;
            } else {
                result = a.id.localeCompare(b.id);
            }

            return sortOrder === "asc" ? result : -result;

        });

    }, [todos, filter, sortField, sortOrder]);

    const totalCount = todos.length;

    const completedCount = todos.filter(t => t.completed).length;

    // Memoized navigation handler to prevent unnecessary re-renders
    // when passing the function to child components
    const handleNavigateAdd = useCallback(() => {
        navigation.navigate("AddTodo");
    }, [navigation]);

  return (
    <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: theme.background
        }}
    >
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#333"
            }}
        >
            <Text
                style={{
                    color: "#fff",
                    fontSize: 22,
                    fontWeight: "bold"
                }}
            >
                Todo List
            </Text>

            <TouchableOpacity
                onPress={handleNavigateAdd}
                style={{ flexDirection: "row", alignItems: "center" }}
            >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 16, marginLeft: 4 }}>
                    Add
                </Text>
            </TouchableOpacity>

        </View>

        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 15,
                marginTop: 10,
                marginBottom:15
            }}
        >

        {/* FILTER DROPDOWN */}

        <Dropdown
            style={{
                width: 140,
                backgroundColor: "#fff",
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 6
            }}
            containerStyle={{
                backgroundColor: "#fff",
                borderRadius: 8
            }}
            itemTextStyle={{ color: "#000" }}
            selectedTextStyle={{ color: "#000" }}
            data={filterOptions}
            labelField="label"
            valueField="value"
            value={filter}
            onChange={item => setFilter(item.value)}
        />

        {/* SORT BUTTON */}

        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10
            }}
        >

            {/* SORT BY RECENT */}

            <TouchableOpacity
                onPress={() => {
                    if (sortField === "recent") {
                    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
                    } else {
                    setSortField("recent");
                    }
                }}
                style={{
                    backgroundColor: "#111",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <Text style={{ color: "#fff", marginRight: 6 }}>
                    Recent
                </Text>

                {sortField === "recent" && (
                    <Ionicons
                        name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                        size={16}
                        color="#fff"
                    />
                )}

            </TouchableOpacity>


            {/* SORT BY ID */}

            <TouchableOpacity
                onPress={() => {
                    if (sortField === "id") {
                    setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
                    } else {
                    setSortField("id");
                    }
                }}
                style={{
                    backgroundColor: "#111",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <Text style={{ color: "#fff", marginRight: 6 }}>
                    ID
                </Text>

                {sortField === "id" && (
                <Ionicons
                    name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
                    size={16}
                    color="#fff"
                />
                )}

            </TouchableOpacity>

        </View>

    </View>

        <Text style={{
                textAlign: "center",
                color: theme.text,
                marginBottom: 12,
                fontSize: 16
            }}
        >
            Total: {totalCount}   Completed: {completedCount}
        </Text>

        {/* 
            FlatList is used instead of ScrollView for better performance
            when rendering large lists. The configuration below optimizes
            rendering by limiting the number of items rendered at once.
        */}
        <FlatList
            data={sortedTodos.slice(0, visibleCount)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TodoItem todo={item} />}
            onEndReached={loadMoreTodos}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            ListFooterComponent={
                loadingMore ? (
                <View style={{ padding: 20 }}>
                    <ActivityIndicator size="small" color="#fff" />
                </View>
                ) : null
            }
        />
    </SafeAreaView>
  )
}