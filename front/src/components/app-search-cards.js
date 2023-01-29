import { observer } from 'mobx-react-lite'
import useGetRepositorys from './../hooks/use-get-repositorys'
import useFindRepository from './../hooks/use-find-repository'
import AppSearchCard from './app-search-card'
import mainState from './../main-state'

const AppSearchCards = observer(() => {
  const repositorys = useGetRepositorys()
      , findRepositoryData = useFindRepository(mainState.search)

  const searchRegExp = new RegExp(mainState.search, 'gi')

  const findRepositoryIsInstalled = repositorys.find(({ link }) => link === (findRepositoryData && findRepositoryData.link))

  const repositorysData = !findRepositoryIsInstalled && findRepositoryData
                            ? [findRepositoryData]
                            : repositorys
                                .reduce((ctx, repositoryData, i) => {
                                  const isFind = repositoryData.repository.match(searchRegExp)

                                  if (isFind) {
                                    ctx.push(repositoryData)
                                  }

                                  if (i === repositorys.length - 1) {
                                    if (ctx.length === 0) {
                                      ctx = repositorys
                                    }
                                  }

                                  return ctx
                                }, [])
                                .map(
                                  repositoryData => {
                                    return ({
                                      ...repositoryData,
                                      appsData: repositoryData.appsData.reduce((ctx, app, i) => {
                                          const isFind = app.app.match(searchRegExp)

                                          if (isFind) {
                                            ctx.push(app)
                                          }

                                          if (i === repositoryData.appsData.length - 1) {
                                            if (ctx.length === 0) {
                                              ctx = repositoryData.appsData
                                            }
                                          }

                                          return ctx
                                        }, [])
                                    })
                                  }
                                )

  return repositorysData
            .map(
              (repositoryData, key, stack) => (
                <AppSearchCard key={key} repositoryData={repositoryData} isLine={key < stack.length - 1} />
              )
            )
})

export default AppSearchCards
