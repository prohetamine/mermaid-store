import { observer } from 'mobx-react-lite'
import useGetRepositorys from './../hooks/use-get-repositorys'
import useFindRepository from './../hooks/use-find-repository'
import AppSearchCard from './app-search-card'
import EmptyCards from './empty-cards'

import mainState from './../main-state'

import notFoundImage from './../assets/images/not-found.svg'

const AppSearchCards = observer(() => {
  const repositorysData = useGetRepositorys()
      , findRepositoryData = useFindRepository(mainState.search)
      , normalizeRepositorysData = repositorysData || []

  const searchRegExp = new RegExp(mainState.search, 'gi')

  const findRepositoryIsInstalled = normalizeRepositorysData.find(({ link }) => link === (findRepositoryData && findRepositoryData.link))

  const _repositorysData = !findRepositoryIsInstalled && findRepositoryData
                            ? [findRepositoryData]
                            : normalizeRepositorysData
                                .reduce((ctx, repositoryData, i) => {
                                  const isFind = repositoryData.repository.match(searchRegExp)

                                  if (isFind) {
                                    ctx.push(repositoryData)
                                  }

                                  if (i === normalizeRepositorysData.length - 1) {
                                    if (ctx.length === 0) {
                                      ctx = normalizeRepositorysData
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
                                .sort((a, b) => a.appsData.length - b.appsData.length)

  return repositorysData !== null
            ? _repositorysData.length > 0
                ? _repositorysData
                    .map(
                      (repositoryData, key, stack) => (
                        <AppSearchCard key={key} repositoryData={repositoryData} isLine={key < stack.length - 1} />
                      )
                    )
                : findRepositoryData === null
                    ? (
                      <EmptyCards image={notFoundImage} label="You didn't find anything. What's next?" />
                    )
                    : (
                      null
                    )
            : (
              null
            )
})

export default AppSearchCards
