import axios from 'axios';
import { useEffect, useState } from 'react';


export default function useFetchData(url) {
    const[data,setData] = useState(null);
    const[loading,setLoading] = useState(true);
    const[error,setError] = useState(null);

    const fetchData = async ()=>{
        try{
            const{data} = await axios.get(url);
            setData(data);
        }catch(err){
            setError(err);
        }finally{
            setLoading(false);
        }
        
    }
    useEffect(()=>{
        fetchData();
    },[url]);

    return{data,error,loading};
}
