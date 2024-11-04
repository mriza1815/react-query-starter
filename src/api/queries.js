export const getUsers = ({ queryKey }) => {
    return fetch('https://jsonplaceholder.typicode.com/users').then((res) =>
        res.json()
    )
}

export const getPokemons = async ({ pageParam }) => {
    const res = await fetch(`https://api.escuelajs.co/api/v1/products?limit=10&offset=${pageParam * 10}`)
    res.json()
}

export const getTodos = ({ queryKey }) => {
    return fetch('https://jsonplaceholder.typicode.com/todos').then((res) =>
        res.json()
    )
}

export const getUser = ({ queryKey }) => {
    console.log("queryKey", queryKey[1])
    return fetch(`https://jsonplaceholder.typicode.com/users/${queryKey[1]}`).then((res) =>
        res.json()
    )
}