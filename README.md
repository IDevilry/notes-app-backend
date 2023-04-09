
# notes-app-backend

API для приложения работы с заметками

## Stack
```libs
- Node.js
- GraphQl
- Express
- MongoDB
- Mongoose
```
## Returned fields

### Notes
```types
- ID: ID
- Title: String
- Content: String
- Created At: DateTime
- Updated At: DateTime
```
### Users
```types
- ID: ID
- Username: String
- Email: String
- Notes: [Note]
- Created At: DateTime
- Updated At: DateTime
```

## Examples

#### Get all notes
```gql
query Notes {
  notes {
    
  }
}
```

#### Get one note
Require note id
```gql
query Note($noteId: ID) {
  note(id: $noteId) {
    author {
      
    }
    
  }
}
```

#### Create new note
Require authorization token
```gql
mutation NewNote($content: String!, $title: String!) {
  newNote(content: $content, title: $title) {
    
  }
}
```

#### Update Note
Require authorization token
```gql
mutation UpdateNote($updateNoteId: ID!, $content: String!, $title: String!) {
  updateNote(id: $updateNoteId, content: $content, title: $title) {
    
  }
}
```

#### Delete Note by id
Require authorization token
```gql
mutation DeleteNote($deleteNoteId: ID!) {
  deleteNote(id: $deleteNoteId) {
    id
  }
}
```


### Sign up

#### Return JWT
```gql
mutation SignUp($username: String!, $email: String!, $password: String!) {
  signUp(username: $username, email: $email, password: $password)
}
```

### Sign in

#### Return JWT

```gql
mutation SignIn($password: String!, $email: String!) {
  signIn(password: $password, email: $email)
}
```

### All users
Require authorization token
```gql
query Users {
  users {
    
  }
}
```

### Get one user by id
Require authorization token
```gql
query User($username: String!) {
  user(username: $username) {
  
  }
}
```
