//todos fetch api if firebase db is empty
export const fetchApiTodos = async () => {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=30"
    );

    return await response.json();
};