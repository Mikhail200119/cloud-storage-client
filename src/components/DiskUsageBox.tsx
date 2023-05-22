import { useEffect, useState } from "react"
import {Button, HStack, Spinner, Text} from "@chakra-ui/react"
import apiClient from "../apiClient";
import { FaBeer } from 'react-icons/fa';
import formatBytes from "../SizeCalculation";

const DiskUsageBox = () => {
    const [bytes, setBytes] = useState(0);
    const [loadBytes, setLoadBytes] = useState(true);

    useEffect(()=>{
        apiClient
            .get("/api/files/disk-usage")
            .then(res=>setBytes(res.data))
            .catch(err=>console.log("Error during get disk usage: ", err.message));

            setLoadBytes(false);
    }, [loadBytes]);

    return <>
        <HStack>
            <Text>Disk usage: {formatBytes(bytes)}</Text>
            <Button backgroundColor="blue.200" onClick={()=> {
                setLoadBytes(true);
            }}>Refresh</Button>
        </HStack>
    </>
}

export default DiskUsageBox;