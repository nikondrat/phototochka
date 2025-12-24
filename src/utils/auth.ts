export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'author'
}

const STORAGE_KEY = 'fototochka_auth'

export const auth = {
  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@admin.com' && password === 'admin123') {
          const user: User = {
            id: '1',
            email: 'admin@admin.com',
            name: 'Администратор',
            role: 'admin',
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
          resolve(user)
        } else {
          reject(new Error('Неверный email или пароль'))
        }
      }, 500)
    })
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY)
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    try {
      return JSON.parse(stored) as User
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  },
}

