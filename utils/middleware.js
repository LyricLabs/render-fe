// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
import Cors from 'cors'

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

const middleware = Cors({
  methods: ['GET', 'HEAD'],
})

export const cors = async (req, res) => {
  await runMiddleware(req, res, middleware)
}
