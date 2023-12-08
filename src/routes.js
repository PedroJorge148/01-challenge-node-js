import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const tasks = []

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
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

      tasks.push({
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null
      })

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const rowIndex = tasks.findIndex(row => row.id === id)

      if (rowIndex > -1) {
        const { 
          title,
          description,
        } = req.body
  
        if (!title || !description) {
          return res.writeHead(400).end(JSON.stringify({
            error: 'As propriedades title e description são obrigatórias.' 
          }))
        }

        const updatedTask = tasks[rowIndex]

        updatedTask.title = title
        updatedTask.description = description
        updatedTask.updated_at = new Date()

        tasks[rowIndex] = updatedTask

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

      const rowIndex = tasks.findIndex(row => row.id === id)

      if (rowIndex > -1) {
        tasks.splice(rowIndex, 1)

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

      const rowIndex = tasks.findIndex(row => row.id === id)

      if (rowIndex > -1) {
        const completedTask = tasks[rowIndex]

        completedTask.completed_at = new Date()

        tasks[rowIndex] = completedTask

        return res.writeHead(204).end()
      } else {
        return res.writeHead(404).end(JSON.stringify({
          error: 'Tarefa não encontrada.'
        }))
      }
    }
  }
]