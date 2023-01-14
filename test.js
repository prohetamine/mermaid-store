const axios = require('axios')

;(async (link) => {
  const path = link.match(/:[^\\.]+/)[0].slice(1)

  const apps = await axios.get(`https://raw.githubusercontent.com/${path}/main/mermaid-apps.json`)
                          .then(
                            ({ data: apps }) => apps
                          )
  const fullAppsInfo = await Promise.all(
    apps.map(
      async ({ link }) => {
        const path = link.match(/:[^\\.]+/)[0].slice(1)

        const name = path.match(/[^\/]+$/)[0]

        const package = await axios.get(`https://raw.githubusercontent.com/${path}/main/package.json`)
                                  .then(({ data }) => data)

        return ({
          name,
          zip: `https://codeload.github.com/${path}/zip/refs/heads/main`,
          package,
          link
        })
      }
    )
  )

  const name = path.match(/[^\/]+$/)[0]

  const repository = {
    name,
    apps: fullAppsInfo
  }

  console.log(repository)
})('git@github.com:prohetamine/official.git')
