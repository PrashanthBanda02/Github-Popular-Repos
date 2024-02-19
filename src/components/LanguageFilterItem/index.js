import './index.css'

const LanguageFilterItem = props => {
  const {eachLanguage, onchangeLanguage} = props
  const {id, language} = eachLanguage

  const handleButtonClick = () => onchangeLanguage(id)

  return (
    <li className="Item-container">
      <button
        onClick={handleButtonClick}
        type="button"
        className="LanguageFilterItem-button"
      >
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
