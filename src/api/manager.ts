import axios from '@/axios'

export function login(username: string) {
  return axios.get('/users', {
    params: {
      username: username.trim(),
      // password: ruleForm.password.trim()
    },
  })
}
