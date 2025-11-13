// Система иконок для админки с возможностью динамического управления

export interface IconConfig {
  name: string
  svg: string
  category?: string
}

// Базовые иконки для навигации
export const adminIcons: Record<string, IconConfig> = {
  stats: {
    name: 'Статистика',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 16L9 10L13 14L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17 10V16H3V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    category: 'navigation',
  },
  photos: {
    name: 'Фотографии',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6C2 4.89543 2.89543 4 4 4H6.58579C7.11622 4 7.62493 4.21071 7.99997 4.58579L9.41421 6C9.78929 6.37507 10.2979 6.58579 10.8284 6.58579H14C15.1046 6.58579 16 7.48122 16 8.58579V14C16 15.1046 15.1046 16 14 16H4C2.89543 16 2 15.1046 2 14V6Z" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="10" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
    category: 'navigation',
  },
  authors: {
    name: 'Авторы',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 12C5.58172 12 2 13.7909 2 16V20H18V16C18 13.7909 14.4183 12 10 12Z" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
    category: 'navigation',
  },
  categories: {
    name: 'Категории',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3H8C8.55228 3 9 3.44772 9 4V9C9 9.55228 8.55228 10 8 10H3C2.44772 10 2 9.55228 2 9V4C2 3.44772 2.44772 3 3 3Z" stroke="currentColor" stroke-width="1.5"/>
      <path d="M12 3H17C17.5523 3 18 3.44772 18 4V9C18 9.55228 17.5523 10 17 10H12C11.4477 10 11 9.55228 11 9V4C11 3.44772 11.4477 3 12 3Z" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3 11H8C8.55228 11 9 11.4477 9 12V17C9 17.5523 8.55228 18 8 18H3C2.44772 18 2 17.5523 2 17V12C2 11.4477 2.44772 11 3 11Z" stroke="currentColor" stroke-width="1.5"/>
      <path d="M12 11H17C17.5523 11 18 11.4477 18 12V17C18 17.5523 17.5523 18 17 18H12C11.4477 18 11 17.5523 11 17V12C11 11.4477 11.4477 11 12 11Z" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
    category: 'navigation',
  },
  edit: {
    name: 'Редактировать',
    svg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L16 6M14 4L10 8M2 14L6 10M4 12L8 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    category: 'actions',
  },
  delete: {
    name: 'Удалить',
    svg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    category: 'actions',
  },
  search: {
    name: 'Поиск',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM18 18l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    category: 'actions',
  },
  add: {
    name: 'Добавить',
    svg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3V15M3 9H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    category: 'actions',
  },
  logout: {
    name: 'Выйти',
    svg: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75M12.75 12.75L15.75 9.75M15.75 9.75L12.75 6.75M15.75 9.75H6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    category: 'actions',
  },
  menu: {
    name: 'Меню',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    category: 'ui',
  },
  close: {
    name: 'Закрыть',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    category: 'ui',
  },
  photo: {
    name: 'Фото',
    svg: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4C2 2.89543 2.89543 2 4 2H6.58579C7.11622 2 7.62493 2.21071 7.99997 2.58579L9.41421 4C9.78929 4.37507 10.2979 4.58579 10.8284 4.58579H12C13.1046 4.58579 14 5.48122 14 6.58579V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V4Z" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="8" cy="8" r="1.5" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
    category: 'content',
  },
  star: {
    name: 'Звезда',
    svg: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1L10.09 5.26L15 6.11L11.5 9.26L12.18 14.22L8 11.77L3.82 14.22L4.5 9.26L1 6.11L5.91 5.26L8 1Z" fill="currentColor"/>
    </svg>`,
    category: 'content',
  },
  category: {
    name: 'Категория',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <rect x="12" y="2" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <rect x="2" y="12" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
      <rect x="12" y="12" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
    category: 'content',
  },
  view: {
    name: 'Просмотр',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4C5 4 1.73 7.11 1 10C1.73 12.89 5 16 10 16C15 16 18.27 12.89 19 10C18.27 7.11 15 4 10 4Z" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
    category: 'content',
  },
  money: {
    name: 'Деньги',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="16" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
      <path d="M6 7H14M6 13H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    category: 'content',
  },
  download: {
    name: 'Скачать',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 14V4M10 14L6 10M10 14L14 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3 16H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    category: 'actions',
  },
}

// Функция для получения иконки
export function getIcon(name: string): IconConfig | null {
  return adminIcons[name] || null
}

// Функция для добавления/обновления иконки (для динамического управления)
export function setIcon(name: string, config: IconConfig): void {
  adminIcons[name] = config
}

// Функция для получения всех иконок по категории
export function getIconsByCategory(category: string): IconConfig[] {
  return Object.values(adminIcons).filter((icon) => icon.category === category)
}

// Компонент для отображения иконки
export function renderIcon(name: string, className = ''): string {
  const icon = getIcon(name)
  if (!icon) return ''
  return `<span class="icon ${className}">${icon.svg}</span>`
}

