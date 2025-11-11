import { useQuery, gql } from "@apollo/client";

const MY_REQUESTS = gql`query{ myRequests { id equipmentId quantity status requestDate } }`;

export default function MyRequests() {
  const { data, loading } = useQuery(MY_REQUESTS);
  if(loading) return <div>Loading...</div>;
  return (
    <div style={{padding:20}}>
      <h2>My Requests</h2>
      {data?.myRequests.map(r => (
        <div key={r.id} style={{border:'1px solid #ddd', padding:8, marginBottom:6}}>
          Equipment: {r.equipmentId} | Qty: {r.quantity} | Status: {r.status}
        </div>
      ))}
    </div>
  );
}
