export interface AzureADJwtPayloadDto {
  oid: string
  preferred_username: string
  name?: string
  scp?: string | string[]
}
