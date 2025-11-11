export interface CatalogCategory {
  id: string
  title: string
  description: string
  coverUrl: string
  tags: string[]
}

export interface CuratedCollection {
  id: string
  title: string
  description: string
  imageUrl: string
  stats: {
    items: number
    updated: string
  }
}

export interface WorkflowStep {
  id: string
  title: string
  description: string
  highlight: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  category: string
}

export interface BlogSpotlight {
  id: string
  title: string
  description: string
  imageUrl: string
  linkLabel: string
}

export interface HelpTopic {
  id: string
  title: string
  entries: Array<{
    question: string
    answer: string
  }>
}

export interface SupportChannel {
  id: string
  title: string
  description: string
  contactLabel: string
  contactValue: string
}

export interface MetricHighlight {
  id: string
  label: string
  value: string
  caption: string
}

export interface TimelineMilestone {
  id: string
  period: string
  title: string
  description: string
}

export const catalogCategories: CatalogCategory[] = [
  {
    id: 'editorial',
    title: 'Редакционные подборки',
    description:
      'Коллекции, созданные нашей командой кураторов для журналов, медиа и digital-платформ.',
    coverUrl:
      'https://images.unsplash.com/photo-1525088553748-01d6e210e00b?auto=format&fit=crop&w=920&q=80',
    tags: ['журналистика', 'истории', 'локальный контент'],
  },
  {
    id: 'commercial',
    title: 'Коммерческие лицензии',
    description:
      'Универсальные кадры для рекламных кампаний, презентаций и SMM. Доступны расширенные лицензии.',
    coverUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=920&q=80',
    tags: ['брендинг', 'технологии', 'стартапы'],
  },
  {
    id: 'authentic',
    title: 'Аутентичные истории',
    description:
      'Реальные люди, места и эмоции без постановочных сцен. Создано авторами из локальных сообществ.',
    coverUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=920&q=80',
    tags: ['портреты', 'сообщества', 'lifestyle'],
  },
]

export const curatedCollections: CuratedCollection[] = [
  {
    id: 'nightcities',
    title: 'Night Cities 2025',
    description:
      'Неоновые ландшафты мегаполисов: ночная урбанистика, отражения в стекле, жизнь после заката.',
    imageUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=880&q=80',
    stats: { items: 84, updated: 'Обновлено 3 дня назад' },
  },
  {
    id: 'artisan',
    title: 'Craft & Artisan Stories',
    description:
      'Истории создателей: мастерские, процесс создания, детали и руки, работающие с материалом.',
    imageUrl:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=880&q=80',
    stats: { items: 62, updated: 'Обновлено 1 неделю назад' },
  },
  {
    id: 'climate',
    title: 'Climate Signals',
    description:
      'Визуальные репортажи о климатических изменениях: устойчивые города, чистая энергия, экология.',
    imageUrl:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=880&q=80',
    stats: { items: 47, updated: 'Обновлено вчера' },
  },
]

export const workflowSteps: WorkflowStep[] = [
  {
    id: 'curation',
    title: 'Ручная модерация',
    description:
      'Каждое изображение проходит трёхступенчатую проверку: техническое качество, релевантность и юридическую чистоту.',
    highlight: '36 часов среднее время публикации',
  },
  {
    id: 'licensing',
    title: 'Прозрачные лицензии',
    description:
      'Выбор между редакционной, коммерческой и расширенной лицензией. Все условия — на одной странице.',
    highlight: 'Генерация договора за 1 клик',
  },
  {
    id: 'analytics',
    title: 'Аналитика спроса',
    description:
      'Авторы получают рекомендации по трендам, а покупатели — подборку релевантного контента на основе запросов.',
    highlight: '3 рекомендательных модели',
  },
]

export const blogSpotlight: BlogSpotlight = {
  id: 'color-theory',
  title: 'Цвет как язык бренда: как визуально отличаться в 2025',
  description:
    'Исследование паттернов цвета в кампейнах от локальных брендов, подборка палитр и чек-лист по адаптации в соцсетях.',
  imageUrl:
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  linkLabel: 'Читать исследование',
}

export const blogPosts: BlogPost[] = [
  {
    id: 'ai-trends',
    title: 'AI vs. живые фотографы: кому доверяют бренды',
    excerpt:
      'Обсуждаем, когда генеративные изображения срабатывают, а когда клиенты выбирают реальных авторов и почему.',
    author: 'Марина Савельева',
    date: '2 ноября 2025',
    readTime: '7 мин',
    category: 'Индустрия',
  },
  {
    id: 'storytelling',
    title: 'Построение визуального сторителлинга для продуктовых команд',
    excerpt:
      'Разбираем сценарий запуска нового продукта и показываем, как последовательность фотографий усиливает pitch.',
    author: 'Андрей Ковалёв',
    date: '28 октября 2025',
    readTime: '6 мин',
    category: 'Практика',
  },
  {
    id: 'workflow',
    title: 'Как организовать каталог автора и не потеряться в релизах',
    excerpt:
      'Чек-лист по тегированию, пакетной обработке и созданию коллекций на платформе ФотоТочка.',
    author: 'Елена Рябова',
    date: '21 октября 2025',
    readTime: '5 мин',
    category: 'Авторам',
  },
]

export const helpTopics: HelpTopic[] = [
  {
    id: 'buyers',
    title: 'Покупателям',
    entries: [
      {
        question: 'Как оформить покупку и получить файл?',
        answer:
          'Добавьте нужные фотографии в корзину, выберите тип лицензии и завершите заказ. Готовые файлы появятся в разделе «Мои покупки» и продублируются на email.',
      },
      {
        question: 'Можно ли использовать фото без указания авторства?',
        answer:
          'Для коммерческой лицензии упоминание автора не требуется. В редакционных публикациях следует указать «Фото: имя автора / ФотоТочка».',
      },
    ],
  },
  {
    id: 'authors',
    title: 'Авторам',
    entries: [
      {
        question: 'Какие требования к загружаемым фотографиям?',
        answer:
          'Минимальное разрешение — 4000 px по длинной стороне, формат JPEG, без водяных знаков. Заполните метаданные: описание, ключевые слова, категорию.',
      },
      {
        question: 'Как устроены выплаты?',
        answer:
          'Выплаты происходят раз в две недели на карту или расчётный счёт. Минимальная сумма — 3 000 ₽. Состояние выплат видно в панели автора.',
      },
    ],
  },
  {
    id: 'legal',
    title: 'Юридические вопросы',
    entries: [
      {
        question: 'Что делать при нарушении авторских прав?',
        answer:
          'Напишите в отдел compliance через форму или на legal@fototochka.ru, указав ссылку на нарушающий ресурс и номер лицензии.',
      },
      {
        question: 'Предоставляете ли вы модель-релизы?',
        answer:
          'Да, загружайте релизы моделей и объектов при добавлении фото. Покупатель увидит отметку «Релизы подтверждены».',
      },
    ],
  },
]

export const supportChannels: SupportChannel[] = [
  {
    id: 'chat',
    title: 'Чат с командой',
    description: 'Ответим в течение 5 минут в рабочее время, подключим нужного специалиста.',
    contactLabel: 'Открыть чат',
    contactValue: '@fototochka_support',
  },
  {
    id: 'email',
    title: 'Почта поддержки',
    description: 'Для развёрнутых запросов и прикрепления документов воспользуйтесь почтой.',
    contactLabel: 'Написать письмо',
    contactValue: 'support@fototochka.ru',
  },
  {
    id: 'hotline',
    title: 'Горячая линия',
    description: 'Экстренные вопросы по лицензированию и оплате решаем по телефону.',
    contactLabel: 'Позвонить',
    contactValue: '8 800 505-10-35',
  },
]

export const metricHighlights: MetricHighlight[] = [
  {
    id: 'authors',
    label: 'Активные авторы',
    value: '12 400+',
    caption: 'от локальных сообществ до крупных агентств',
  },
  {
    id: 'photoCount',
    label: 'Фотографии в каталоге',
    value: '1,9 млн',
    caption: 'в 48 направлениях и 310 коллекциях',
  },
  {
    id: 'buyers',
    label: 'Бренды и студии',
    value: '2 700',
    caption: 'подключенных компаний из 12 стран',
  },
]

export const timeline: TimelineMilestone[] = [
  {
    id: '2023',
    period: 'I квартал 2023',
    title: 'Запуск закрытой беты',
    description:
      'Первые 150 авторов и 12 агентств тестируют платформу, проверяем воронку и юридические процессы.',
  },
  {
    id: '2024',
    period: 'III квартал 2024',
    title: 'Масштабирование каталога',
    description:
      'Добавили интеллектуальный поиск по визуальным признакам, открыли доступ для авторов из СНГ.',
  },
  {
    id: '2025',
    period: '2025 сейчас',
    title: 'Переход к marketplace 2.0',
    description:
      'Внедряем персональные storefrontы авторов, интегрируем аналитику покупок и динамическое ценообразование.',
  },
]

