В приложении реализованы:

-   Каталог товаров (получение данных через API)
-   Страница отдельного товара
-   Корзина (работает через API)
-   Избранное (favorites)
-   Профиль пользователя
-   Работа с категориями (получение данных через API)
-   Анимации, skeleton-загрузки, всплывающие уведомления (toast)
-   Состояние приложения — Zustand
-   Архитектура проекта: feature-sliced design

Технологии:
React, React Router v6, Zustand, Vite, CSS-модули, Framer Motion

Структура проекта:

1. app — инициализация приложения, роутинг
2. entities — бизнес-сущности (product, category)
3. features — независимые фичи (cart, favorites, profile)
4. pages — страницы (catalog, cart, profile, product)
5. widgets — составные блоки (TopBar, BottomNav и другие)
6. shared — переиспользуемые компоненты, утилиты, api, хуки

Проект разрабатывался совместно с backend-разработчиком. В процессе был постоянный диалог по структуре, API и оптимизации архитектурных решений.

Запуск проекта:
git clone https://github.com/doublebanan/mag.git
cd mag
npm install
npm run dev
