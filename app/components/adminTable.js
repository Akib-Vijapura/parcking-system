"use client";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

  const dateOptions = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
    //timeZoneName: 'short',
  };
  

const getDateTimeFormatted = (dateTime) => {
  const dateObj = new Date(dateTime)
  const formattedDate = new Intl.DateTimeFormat('en-IN', dateOptions).format(dateObj);
  return formattedDate;
}

const AdminTable = ({ data }) => {

  console.log("ADMIN TABLE DATA: ", data)

    return (
<TableContainer marginTop="2.5vh" p="5%" w={"100%"} >
  <Table variant='simple'>
    <TableCaption>Imperial to metric conversion factors</TableCaption>
    <Thead>
      <Tr>
        <Th>VEHICLE NUMBER</Th>
        <Th>VEHICLE TYPE</Th>
        <Th>Date & Time</Th>
        <Th>VEHICLE CHARGE</Th>
      </Tr>
    </Thead>
    <Tbody>
      {data.flatMap((vehicle, index) => (
        <Tr key={vehicle._id}>
        
        <Td>{vehicle.vehicleNumber}</Td>
        <Td>{vehicle.vehicleType}</Td>
        <Td>{getDateTimeFormatted(vehicle.dateTime)}</Td>
        <Td>{vehicle.vehicleCharge}</Td>
      </Tr>
      ))}
   
    </Tbody>
    {/*<Tfoot>
      <Tr>
        <Th>To convert</Th>
        <Th>into</Th>
        <Th isNumeric>multiply by</Th>
      </Tr>
    </Tfoot>*/}
  </Table>
</TableContainer>
    )

}

export default AdminTable