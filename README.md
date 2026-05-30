# Job Journal — Frontend

## Стек

Next.js 16 · React 19 · TypeScript · HeroUI · Tailwind CSS 4 · TanStack React Query · TanStack Table · MobX · React Hook Form · Zod · NextAuth

## Почему так

- **Next.js** — Server Actions проксируют API на сервере, JWT не утекают в клиент; route groups для auth/dashboard + удобное кеширование данных на сервере, для ослабления нагрузки на бек + возможность писать внутренний бекенд для тесного взаимодействия с беком
- **React Query** — кэш и CRUD для данных с API;
- **MobX** — гибкий стейтменеджер
- **HeroUI + Tailwind** — готовые a11y-компоненты, быстрая вёрстка, тёмная тема + идеальная интеграция с NEXTjs
- **RHF + Zod** — формы без лишних ре-рендеров, гибкая валидация зода с последующими трансформациями payload если это нужно + поддержка резолвера для валидации форм
- **NextAuth** — JWT-сессия, auto-refresh, + очень много встроенных из коробкм провайдеров + удобное изменение сессии

## Запуск

переименовать .env.example => .env.local

```bash
npm install
npm run dev   # :3166
```
