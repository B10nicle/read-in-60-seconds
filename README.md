# Read in 60 Seconds

Публичный проект трекера IT-книг, вдохновлённый доской из фильма [Gone in 60 Seconds («Угнать за 60 секунд»)](https://gonein60seconds.com/): собери список и вычёркивай прочитанное.

Read in 60 Seconds — отсылка к названию фильма, а не обещание прочитать книгу за минуту. Независимый проект для читателей, не связанный с правообладателями фильма.

## Статус

Стартовый браузерный прототип. Каждый посетитель может вести собственный список на своём устройстве. Пока нет регистрации, серверной базы данных, синхронизации и публичных профилей. Публичность репозитория не означает, что сайт уже размещён в интернете.

Исходные `/mnt/data/it-books-60/index.html` и `/mnt/data/code60-prototype.zip` из предыдущей беседы не были доступны при создании репозитория. Эта версия заново реализует доступное текстовое описание, а не копирует недоступный прототип.

## Возможности

- Каталог из 60 IT-книг в восьми категориях; можно добавлять свои книги.
- Добавление собственных книг и удаление с подтверждением.
- Отметка прочитанного с вычёркиванием, счётчик и индикатор прогресса.
- Поиск по названию и автору, фильтрация по статусу.
- Сохранение в localStorage, адаптивная разметка и управление с клавиатуры.

Прогресс привязан к браузеру и адресу сайта. Очистка данных браузера удалит доску. Не используйте её как единственное место хранения важного списка.

## Запуск

Нужен Python 3. В папке проекта:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Откройте http://localhost:8080. Сборка и внешние зависимости не нужны.

## Структура

```text
index.html          Лендинг и доска
assets/styles.css   Гаражная доска и адаптивное оформление
assets/catalog.js   Каталог из 60 книг
assets/garage.png   Сгенерированный фон гаража
assets/paper.svg    Текстура доски
assets/app.js       Работа со списком и localStorage
docs/ROADMAP.md      План публичного сервиса
```

## Проверка

```sh
node --check assets/app.js
```

В браузере проверьте добавление книги, вычёркивание, обновление страницы, поиск, оба фильтра и удаление. Проверьте ширину 375 px и переходы клавишей Tab. Пользовательский текст выводится через textContent.

## Размещение

Можно подключить GitHub Pages: Settings → Pages → Deploy from a branch → main → / (root). Либо разместить содержимое на любом статическом хостинге с HTTPS. Серверные возможности из дорожной карты потребуют отдельной реализации.

## Визуальная версия

Доска с обложками по категориям, красные кресты для прочитанного и реальные счётчики. Обложки загружаются из Open Library по ISBN; при отсутствии картинки показывается типографическая обложка. Шрифты — Google Fonts (Barlow Condensed, Caveat, Inter). Фон создан с помощью ImageGen. Старый прогресс `code60.board.v1` переносится в `read60.board.v2` при первом сохранении новой версии.

## Первый экран по референсу

Первый экран использует `assets/reference-garage.png`: фон обработан ImageGen по предоставленному пользователем референсу, интерфейс и старые кресты удалены. Обложки на этом экране — часть иллюстрации; 24 доступные кнопки поверх них связаны с каталогом и реальным прогрессом. Координаты в `previewBooks` соответствуют изображению 1536×1024. На телефоне доска показывается отдельным блоком. Полный каталог ниже остаётся отдельными карточками. Счётчики не подменяются демонстрационными числами из референса.

## Frontend / backend separation

This repository is the static **frontend**. Java 21 / PostgreSQL API, migrations, tests and the complete Docker development stack live in [read-in-60-seconds-backend](https://github.com/B10nicle/read-in-60-seconds-backend).

The frontend calls `/api` on the same origin, uses cookie sessions with CSRF tokens, and displays a login/registration dialog. Authenticated boards are stored on the server; guest boards stay in localStorage. Signing in does not import guest data automatically, and logout restores it. Cover URLs are required for new books.

For full local startup follow the backend README. GitHub Pages currently remains a guest demo: Java/PostgreSQL hosting must be configured before public account login is enabled. `assets/account.js` disables API requests on `*.github.io`; use the full same-origin deployment for accounts. An optional `window.READ60_API_BASE` override must be defined before account.js if deploying elsewhere, with corresponding CORS and cookie settings.
