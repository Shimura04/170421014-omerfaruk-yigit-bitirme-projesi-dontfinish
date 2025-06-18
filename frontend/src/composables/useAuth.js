export function useAuth() {
  async function checkAuth() {
    try {
      const request = await fetch('http://localhost:3000/api/v1/auth/me', {
        credentials: 'include',
      })
      const response = await request.json()

      // If token was refreshed, server already returned success
      if (response.status === 'success') {
        return true
      }

      // If unauthorized, don't retry
      return false
    } catch (err) {
      return false
    }
  }

  return {
    checkAuth,
  }
}
