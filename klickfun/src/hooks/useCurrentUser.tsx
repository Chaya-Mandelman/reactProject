
// import { useEffect } from "react"
// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import axios from "axios"
// import { getCurrentUser } from "../api/getCurrentUser"
// import { useAuth } from "../context/user"

// export function useCurrentUser() {
//   const { user, setUser } = useAuth()
//   const queryClient = useQueryClient()
//   const token = localStorage.getItem("token")

//   const query = useQuery({
//     queryKey: ["currentUser", token],
//     queryFn: getCurrentUser,
//     enabled: !!token && !user,
//     staleTime: Infinity,
//     retry: (failureCount, error) =>
//       !(axios.isAxiosError(error) &&
//         error.response?.status === 401) &&
//       failureCount < 2,
//   })

//   // שמירת המשתמש ב-Context
//   useEffect(() => {
//     if (query.data?.user) {
//       setUser(query.data.user)
//     }
//   }, [query.data, setUser])

//   // טיפול בטוקן לא תקין
//   useEffect(() => {
//     if (
//       !axios.isAxiosError(query.error) ||
//       query.error.response?.status !== 401
//     ) return

//     localStorage.removeItem("token")
//     setUser(null)
//     queryClient.removeQueries({
//       queryKey: ["currentUser"],
//     })
//   }, [query.error, setUser, queryClient])

//   return {
//     user,
//     isAuthenticated: !!user,
//     isLoading: !!token && !user &&
//       query.isPending && query.isFetching,
//     error: query.error,
//     refetch: query.refetch,
//   }
// }
