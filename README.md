
# API приложения "Моя заметочка"

Это приложение представляет собой серверное API, написанное на TypeScript с использованием GraphQl, Express и Mongoose. Оно позволяет работать с заметками и пользователями.


## API Reference

### Note

| Поле | Тип     | Описание |
| :-------- | :------- | :------|
| `id` | `string` | id |
|`title` | `string` | Заголовок заметки |
|`content` | `string` | Контент заметки |
|`category` | `string` | Категория заметки |
|`addedToFavoriteTimes` | `number` | Сколько раз заметка была добавлена в избранное |
|`favoritedBy` | `User[]` | Массив пользователей, добавивших заметку в избранное |
|`createdAt` | `Date` | Дата создания в формате ISO |
|`updatedAt` | `Date` | Дата последнего обновления в формате ISO |

### User

| Поле | Тип     | Описание  |
| :-------- | :------- | :------------------------- |
| `id` | `string` | id |
|`username` | `string` | Имя пользователя |
|`email` | `string` | Электронная почта пользователя |
|`notes` | `Note[]` | Массив заметок пользователя |
|`favoriteNotes` | `Note[]` | Массив избранных заметок пользователя |
|`CreatedAt` | `Date` | Дата создания в формате ISO |
|`UpdatedAt` | `Date` | Дата последнего обновления в формате ISO |


## Query

```gql
notes: [Note!]!

note(id: ID): Note!

user: User

userById(id: ID!): User

users: [User!]!
```

## Mutation 

```gql
newNote(content: String!, title: String!, category: String!): Note!

deleteNote(id: ID!): Note!

updateNote(id: ID!, content: String!, title: String!): Note!

toggleFavoriteNote(id: ID!): Note!

signUp(username: String!, email: String!, password: String!): String!

signIn(username: String, email: String!, password: String!): String!
```
## Переменные окружения

Чтобы запустить этот проект, вам нужно будет добавить следующие переменные среды в ваш файл `.env`

`JWT_SECRET_KEY` - Ключ для генерации JWT токена

`DB_HOST` - URL БД


## Установка


1. Убедитесь, что на вашем компьютере установлены [Node.js](https://nodejs.org/en) и [MongoDB](https://www.mongodb.com/).

2. Клонируйте репозиторий на ваш компьютер.

```bash
git clone https://github.com/IDevilry/notes-app-server.git
```

3. Перейдите в директорию проекта.

```bash
cd notes-app-server
```

4. Установите все необходимые зависимости. 

```bash
npm install
```

5. Создайте файл `.env` и объявите в нём вышеописанные переменные

```env
JWT_SECRET_KEY=secret

DB_HOST=mongodb://localhost:27017/
```

6. Запустите проект.

```bash
npm start
```

## Примеры запросов


### Все заметки

```gql
query Notes {
  notes {
    id
    title
    content
    createdAt
    author {
      id
      username
    }
  }
}
```

### Получение одной заметки
#### Небходимо передать ID

```gql
query Note(id: "NoteID") {
  note(id: "noteID"){
    id
    title
    content
    category
    author {
      id
      username
    }
  }
}
```

### Создание новой заметки
#### Необходимо передать в заголовок запроса авторизационный Bearer токен.
 

```gql
mutation NewNote($content: String!, $title: String!, $category: String!) {
  newNote(content: $content, title: $title, category: $category) {
    id
    title
    content
    category
    author {
      id
      username
    }
  }
}
```

### Обновление заметки
#### Необходимо передать в заголовок запроса авторизационный Bearer токен

```gql
mutation UpdateNote($updateNoteId: ID!, $content: String!, $title: String!, $category: String!) {
  updateNote(id: $updateNoteId, content: $content, title: $title, category: $category) {
    id
    title
    content
    category
    author {
      id
      username
    }
  }
  }
}
```

### Удаление заметки
#### Необходимо передать в заголовок запроса авторизационный Bearer токен

```gql
mutation DeleteNote($id: ID!) {
  deleteNote(id: $id) {
    id
  }
}
```

### Регистрация нового пользователя
#### При успешном выполнении возвращает авторизационный Bearer токен

```gql
mutation SignUp($username: String!, $email: String!, $password: String!) {
  signUp(username: $username, email: $email, password: $password) {
    jwt
  }
}
```

### Авторизация
#### При успешном выполнении возвращает авторизационный Bearer токен

```gql
mutation SignIn($password: String!, $email: String!) {
  signIn(password: $password, email: $email) {
    jwt
  }
}
```
