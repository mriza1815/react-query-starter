import './App.css'
import { useMutation, useQuery, useQueryClient, keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { getPokemons, getTodos, getUser, getUsers } from './api/queries'
import { updateUser } from './api/mutations'
import Loading from './components/Loading'
import Fallback from './components/Fallback'
import { useState } from 'react'

function App() {

  //Local State
  const [userId, setUserId] = useState(null)
  
  // Access the client
  const queryClient = useQueryClient()

  // Queries

  // The following two queries will execute in parallel
  const users = useQuery({ 
    queryKey: ['getUsers'], 
    queryFn: getUsers, 
    retry: 10, 
    retryDelay: 1000,
    initialData: [], // This data is persisted to the cache
    placeholderData: [], // This data not persisted to the cache
    staleTime: 0,  //Show initialData and refetch query immediately
    //staleTime: 1000,  //Show initialData immediately, but won't refetch until another interaction event is encountered after 1000 m
  })
  const todos = useQuery({ queryKey: ['getTodos'], queryFn: getTodos })
  
  //The following query exacute when userId state has generated. Paginating Query
  const { data: userData } = useQuery({ 
    queryKey: ['getUser', userId], 
    queryFn: getUser, 
    enabled: !!userId,
    placeholderData: keepPreviousData, // The data from the last successful fetch is available while new data is being requested, even though the query key has changed.
  })
  
  //Infinite Query (Can't get data, Will look after)
  const {
    data: postData,
    error: postError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['getPokemons'],
    queryFn: getPokemons,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage && lastPage.length === 0) {
        return undefined
      }
      return lastPageParam + 1
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined
      }
      return firstPageParam - 1
    },
  })
  
  const getUserInfo = id => {
    setUserId(id)
  }
  
  const refreshMyData = id => {
    // İlgili query'nin verisinin eski olduğu veyenilenmesi gerektiği düşünüldüğünde invalidateQueries işlemi yapılır. refetch yapılarak data güncellenir
    // Genellikle mutation işlemi tamamlandıktan sonra invalidate işleminin yapılması mantıklıdır
    queryClient.invalidateQueries({ queryKey: ['getUsers'] })
  }

  // Mutations
  const mutation = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: updateUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['getUsers'] })
    },
  })

  const { isPending, error, data: usersList, isPlaceholderData } = users

  if (isPending) return <Loading/>

  if (error) return <Fallback error={error} />

  return (
    <div>
      <button onClick={refreshMyData}>
        Data'mı Yenile
      </button>
      <button
      onClick={() => {
        mutation.mutate({
          id: 1,
          name: 'Mordecai',
        })
      }}>
        Güncelle adamım
      </button>
      <div className="user-window">
        <ul className="user-list">
          {usersList.map((user, key) => (
            <li key={`user-${key}-${user.id}`}>
              <span>{user.name}</span>
              <button onClick={() => getUserInfo(user.id)}>Bilgiler</button>
            </li>
          ))}
        </ul>
        <div>
          <span>Seçili Kullanıcı Bilgileri</span>
          <div>
            {userData ? (
              <ul>
                {Object.values(userData).splice(0,4).map(userVal => (
                  <li>{userVal}</li>
                ))}
              </ul>
            ): null}
          </div>
        </div>
      </div>
      <div className="posts">
            {postData ? postData.pages.map((currentPostData, index) => (
              <div key={`posts-${index}`}>
                <h1>{currentPostData ? currentPostData.title : ""}</h1>
                <p>{currentPostData ? currentPostData.description : ""}</p>
              </div>
            )): null}
            <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
        </button>
      </div>
    </div>
  )
}

export default App
