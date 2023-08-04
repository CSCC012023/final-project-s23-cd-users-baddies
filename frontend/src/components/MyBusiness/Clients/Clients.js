import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    Card,
    Text,
    Image,
    Heading,
    Divider,
    Stack,
    CardBody,
} from '@chakra-ui/react';
import { UserContext } from '../../User/UserContext';

function ClientCard({ name }) {
    const [clientData, setClientData] = useState([]);

    useEffect(() => {
        fetchClientData();
    }, []);

    const user = useContext(UserContext);
    const fetchClientData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/clients/${user.uid}`);
            const clients = response.data;

            const clientDetailsPromises = clients.map((client) => fetchClientDetails(client.client._path.segments[1]));
            const clientDetails = await Promise.all(clientDetailsPromises);

            const clientDataArray = clients.map((client, index) => ({
                clientId: client.client.uid,
                lastDealTimestamp: formatTimestamp(client.lastDeal),
                ...clientDetails[index],
            }));

            setClientData(clientDataArray);
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };

    const fetchClientDetails = async (clientId) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/profile/${clientId}`);
            const clientDetails = response.data;
            return clientDetails;
        } catch (error) {
            console.error('Error fetching client details:', error);
            return {};
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            console.error("Invalid timestamp:", timestamp);
            return "";
        } else {
            const options = {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: 'numeric',
                minute: 'numeric',
                timeZoneName: 'short',
                timeZone: 'America/New_York' // set timezone to Eastern Time
            };
            return date.toLocaleString('en-US', options);
        }
    };
    
    
    

    return (
        <>
            {clientData.map((client) => (
                <Card key={client.clientId} w="350px" maxW="sm" m="10px">
                    <CardBody>
                        <Image
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFM2xO66q5ZRKDMpfvX2sjaf1awJlAkvrQXw&usqp=CAU"
                            alt="Service"
                            borderRadius="lg"
                        />
                        <Stack mt="6" spacing="3">
                            <Heading size="md">{client.Name}</Heading>
                            <Text>Last Deal: {client.lastDealTimestamp}</Text>
                            <Text>Location: {client.Location}</Text>
                            <Text>Rating: {client.Rating}</Text>
                            <Text>Contact Number: {client.contactNumber}</Text>
                            <Text>Postal Code: {client.postalCode}</Text>
                            <Text>User Type: {client.userType}</Text>
                        </Stack>
                    </CardBody>
                    <Divider />
                </Card>
            ))}
        </>
    );
}

export default ClientCard;
