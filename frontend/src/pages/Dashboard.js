import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";

const EQ_LIST = gql`query($q:String,$category:String,$available:Boolean){ equipmentList(q:$q,category:$category,available:$available){ id name category availableQty } }`;

export default function Dashboard() {
  const { data, loading, error } = useQuery(EQ_LIST, { variables: {} });
  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error loading equipment</div>;
  return (
    <div style={{padding:20}}>
      <h2>Equipment List</h2>
      <Link to="/my-requests">My Requests</Link> | <Link to="/admin/requests">Admin Requests</Link>
      {data?.equipmentList.map(e => (
        <div key={e.id} style={{border:'1px solid #ccc', padding:10, marginBottom:8}}>
          <strong>{e.name}</strong> - {e.category} - Available: {e.availableQty}
          <div><Link to={`/request/${e.id}`}>Request</Link></div>
        </div>
      ))}
    </div>
  );
}
