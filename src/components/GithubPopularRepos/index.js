import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class GithubPopularRepos extends Component {
  state = {
    activelanguage: languageFiltersData[0].id,
    updatedData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getLanguagesRepos()
  }

  getLanguagesRepos = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activelanguage} = this.state

    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activelanguage}`

    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()

      const filteredData = data.popular_repos.map(eachRepo => ({
        name: eachRepo.name,
        id: eachRepo.id,
        issuesCount: eachRepo.issues_count,
        forksCount: eachRepo.forks_count,
        starsCount: eachRepo.stars_count,
        avatarUrl: eachRepo.avatar_url,
      }))
      this.setState({
        updatedData: filteredData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onchangeLanguage = id => {
    this.setState({activelanguage: id}, this.getLanguagesRepos)
  }

  renderLanguageFilters = () => (
    <ul className="languageFilters-container">
      {languageFiltersData.map(eachItem => (
        <LanguageFilterItem
          key={eachItem.id}
          eachLanguage={eachItem}
          onchangeLanguage={this.onchangeLanguage}
        />
      ))}
    </ul>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-img"
      />
      <p className="failure-view-para">Something Went Wrong</p>
    </div>
  )

  renderRepositoryItems = () => {
    const {updatedData} = this.state
    return (
      <div className="RepositoryItems-container">
        {updatedData.map(each => (
          <RepositoryItem key={each.id} repositoryDetails={each} />
        ))}
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    return (
      <div className="app-container">
        <h1 className="app-title">Popular</h1>
        {this.renderLanguageFilters()}
        {(() => {
          switch (apiStatus) {
            case apiStatusConstants.success:
              return this.renderRepositoryItems()
            case apiStatusConstants.failure:
              return this.renderFailureView()
            case apiStatusConstants.inProgress:
              return this.renderLoader()
            default:
              return null
          }
        })()}
      </div>
    )
  }
}

export default GithubPopularRepos
