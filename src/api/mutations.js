export const updateUser = ({id, name}) => {
    return fetch('https://jsonplaceholder.typicode.com/users/1', {
        method: 'PUT',
        body: JSON.stringify({
          id,
          name,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    })
}