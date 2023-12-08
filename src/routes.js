import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"
import { Database } from "./database.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      }: null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { 
        title,
        description,
      } = req.body

      if (!title || !description) {
        return res.writeHead(400).end(JSON.stringify({
          error: 'As propriedades title e description são obrigatórias.' 
        }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const data = req.body

      if (!data.title || !data.description) {
        return res.writeHead(400).end(JSON.stringify({
          error: 'As propriedades title e description são obrigatórias.' 
        }))
      }

      if (database.update('tasks', id, data)) {

        return res.writeHead(204).end()

      } else {
        return res.writeHead(404).end(JSON.stringify({
          error: 'Tarefa não encontrada.'
        }))
      }

    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      if (database.delete('tasks', id)) {
        
        return res.writeHead(204).end()

      } else {
        return res.writeHead(404).end(JSON.stringify({
          error: 'Tarefa não encontrada.'
        }))
      }
      
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      if (database.completeTask('tasks', id)) {

        return res.writeHead(204).end()

      } else {
        return res.writeHead(404).end(JSON.stringify({
          error: 'Tarefa não encontrada.'
        }))
      }
    }
  }
]