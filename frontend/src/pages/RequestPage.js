import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const REQ_MUT = gql`mutation($equipmentId:ID!,$quantity:Int!,$notes:String){ requestEquipment(equipmentId:$equipmentId,quantity:$quantity,notes:$notes){ id status } }`;

export default function RequestPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const [qty,setQty] = useState(1);
  const [doReq] = useMutation(REQ_MUT);

  const submit = async () => {
    await doReq({ variables: { equipmentId: id, quantity: parseInt(qty,10), notes: '' } });
    nav('/my-requests');
  };

  return (
    <div style={{padding:20}}>
      <h2>Request Equipment</h2>
      <p>Equipment ID: {id}</p>
      <input value={qty} onChange={(e)=>setQty(e.target.value)}/>
      <button onClick={submit}>Submit Request</button>
    </div>
  );
}
