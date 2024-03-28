export const AddContractCast =
`
mutation AddContractCast(
  $abi: String!, 
  $address: String!, 
  $chainId: Int!, 
  $program: String!, 
  $type: ContractCastType!, 
  $startFrom: Int!) {
  createContractCast(
    data: {address: $address, chainId: $chainId, program: $program, type: $type, abi: $abi, startFrom: $startFrom}
  ) {
    id
  }
}
`;