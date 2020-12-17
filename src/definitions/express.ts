export interface User {
  id: number
  username: string
  roles: Array<string>
  settings: { [key: string]: any }
}
