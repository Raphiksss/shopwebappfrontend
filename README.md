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
git clone https://github.com/doublebanan/mag.gi*t
cd mag*
npm install
npm run dev


## Telegram WebApp

Приложение теперь инициализируется через Telegram WebApp. Для локальной отладки вне Telegram создайте файл `.env.local` и задайте переменную:

```
VITE_DEV_TG_ID=1

```

На проде`tg_id` автоматически берётся из `window.Telegram.WebApp.initDataUnsafe.user.id`.

Клиентские запросы (профиль, корзина, избранное, заказы, пополнение баланса) идут с токеном, который бек выдаёт на `/users/login/` в обмен на `initData`. Вне Telegram `initData` нет, поэтому эти функции там не работают, и `VITE_DEV_TG_ID` их не включает.

