'use client'
import { useGetAllUserQuery } from '@/src/redux/features/user/userApi';

const Page = () => {
const {data:users}=useGetAllUserQuery(undefined)

// const users = user?.data

console.log("All Users:", users);   

//   useEffect(() => {
//     // Fetch all users from your API
//     fetch('http://localhost:5000/api/v1/user/allUsers')
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setUsers(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);


  return (
    <div>
      <h1>All Users</h1>
      {/* <ul>
        {users.map((user:any) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default Page;
