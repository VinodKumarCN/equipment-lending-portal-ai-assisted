import { useQuery, gql, useMutation } from "@apollo/client";

const ALL_REQ = gql`query{ allRequests { id equipmentId userId quantity status } }`;
const APPROVE = gql`mutation($id:ID!){ approveRequest(id:$id){ id status } }`;
const ISSUE = gql`mutation($id:ID!, $dueDate:String){ issueRequest(id:$id,dueDate:$dueDate){ id status } }`;

export default function AdminRequests(){
  const { data, loading, refetch } = useQuery(ALL_REQ);
  const [approve] = useMutation(APPROVE);
  const [issue] = useMutation(ISSUE);

  if(loading) return <div>Loading...</div>;
  return (
    <div style={{padding:20}}>
      <h2>Admin Requests</h2>
      {data?.allRequests.map(r => (
        <div key={r.id} style={{border:'1px solid #ddd', padding:8, marginBottom:6}}>
          User: {r.userId} | Equipment: {r.equipmentId} | Qty: {r.quantity} | Status: {r.status}
          <div>
            {r.status === 'PENDING' && <button onClick={async ()=>{ await approve({variables:{id:r.id}}); refetch(); }}>Approve</button>}
            {r.status === 'APPROVED' && <button onClick={async ()=>{ await issue({variables:{id:r.id,dueDate:null}}); refetch(); }}>Issue</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
