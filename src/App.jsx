import { useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import './App.css'

const BENEFITS = [
  '🚀 Бесплатный ранний доступ',
  '📊 Отчет по результатам исследования рынка',
  '🎯 Возможность повлиять на функциональность продукта',
  '🤝 Приоритетное участие в закрытом тестировании',
]

const LIMIT_MESSAGE = 'Можно выбрать не более 5 вариантов.'

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwoF-bRpWP1SoKQxA2gGb2LRz5J-J9QYdU6fShp8zlGCXCmKJCfDztX5eGzOqF-klRNGg/exec'

const TIME_OPTIONS = [
  { label: 'Контроль остатков', field: 'TC_Inventory' },
  { label: 'Планирование закупок', field: 'TC_Purchasing' },
  { label: 'Поиск новых товаров', field: 'TC_NewProducts' },
  { label: 'Управление рекламой', field: 'TC_Ads' },
  { label: 'Оптимизация ставок рекламы', field: 'TC_AdBids' },
  { label: 'Анализ конкурентов', field: 'TC_Competitors' },
  { label: 'Ценообразование', field: 'TC_Pricing' },
  { label: 'Отслеживание цен конкурентов', field: 'TC_CompetitorPrices' },
  { label: 'Создание карточек товаров', field: 'TC_ProductCards' },
  { label: 'Генерация описаний', field: 'TC_Descriptions' },
  { label: 'Генерация фото / изображений', field: 'TC_Images' },
  { label: 'SEO карточек', field: 'TC_SEO' },
  { label: 'Работа с отзывами', field: 'TC_Reviews' },
  { label: 'Ответы на вопросы покупателей', field: 'TC_Questions' },
  { label: 'Финансовый учет', field: 'TC_Finance' },
  { label: 'Контроль прибыли', field: 'TC_Profit' },
  { label: 'Подготовка отчетности', field: 'TC_Reporting' },
  { label: 'Логистика и поставки', field: 'TC_Logistics' },
  { label: 'Работа с возвратами', field: 'TC_Returns' },
  { label: 'Анализ продаж', field: 'TC_SalesAnalysis' },
  { label: 'Работа с поставщиками', field: 'TC_Suppliers' },
  { label: 'Контроль качества товара', field: 'TC_Quality' },
  { label: 'Управление командой', field: 'TC_Team' },
  { label: 'Поиск подрядчиков', field: 'TC_Contractors' },
  { label: 'Работа с документами', field: 'TC_Documents' },
  {
    label: 'Что-то другое',
    field: 'TC_Other',
    otherTextField: 'TC_Other_Text',
  },
]

const STRESS_OPTIONS = [
  {
    label: 'Потеря продаж из-за отсутствия товара',
    field: 'ST_OOS',
  },
  { label: 'Излишние остатки', field: 'ST_Overstock' },
  { label: 'Замороженные деньги в товаре', field: 'ST_FrozenCash' },
  {
    label: 'Ошибки прогнозирования спроса',
    field: 'ST_DemandForecastErrors',
  },
  { label: 'Нестабильные продажи', field: 'ST_UnstableSales' },
  { label: 'Реклама работает нестабильно', field: 'ST_UnstableAds' },
  { label: 'Слив рекламного бюджета', field: 'ST_AdBudgetWaste' },
  { label: 'Рост конкуренции', field: 'ST_CompetitionGrowth' },
  { label: 'Демпинг конкурентов', field: 'ST_CompetitorDumping' },
  { label: 'Снижение маржи', field: 'ST_MarginDecline' },
  { label: 'Кассовый разрыв', field: 'ST_CashGap' },
  { label: 'Недостаток времени', field: 'ST_LackOfTime' },
  { label: 'Слишком много ручной работы', field: 'ST_ManualWork' },
  { label: 'Ошибки сотрудников', field: 'ST_EmployeeErrors' },
  { label: 'Блокировки карточек', field: 'ST_CardBlocks' },
  { label: 'Плохие отзывы', field: 'ST_BadReviews' },
  { label: 'Возвраты', field: 'ST_Returns' },
  { label: 'Штрафы маркетплейсов', field: 'ST_MarketplacePenalties' },
  {
    label: 'Нестабильность правил маркетплейсов',
    field: 'ST_RuleChanges',
  },
  { label: 'Сложность аналитики', field: 'ST_AnalyticsComplexity' },
  { label: 'Непонятная прибыльность', field: 'ST_UnclearProfit' },
  {
    label: 'Сложность масштабирования бизнеса',
    field: 'ST_ScalingComplexity',
  },
  {
    label: 'Зависимость от одного маркетплейса',
    field: 'ST_MarketplaceDependency',
  },
  { label: 'Сложность найма людей', field: 'ST_HiringDifficulty' },
  { label: 'Выгорание собственника', field: 'ST_OwnerBurnout' },
  { label: 'Другое', field: 'ST_Other', otherTextField: 'ST_Other_Text' },
]

const AUTOMATE_OPTIONS = [
  { label: 'Контроль остатков', field: 'AU_Inventory' },
  { label: 'Прогнозирование закупок', field: 'AU_PurchasingForecast' },
  { label: 'Управление рекламой', field: 'AU_Ads' },
  { label: 'Оптимизация ставок', field: 'AU_AdBids' },
  { label: 'Мониторинг конкурентов', field: 'AU_CompetitorMonitoring' },
  { label: 'Изменение цен', field: 'AU_Pricing' },
  { label: 'Отслеживание маржинальности', field: 'AU_MarginTracking' },
  { label: 'Создание карточек товаров', field: 'AU_ProductCards' },
  { label: 'Генерация описаний', field: 'AU_Descriptions' },
  { label: 'Генерация изображений', field: 'AU_Images' },
  { label: 'SEO карточек', field: 'AU_SEO' },
  { label: 'Ответы на отзывы', field: 'AU_Reviews' },
  { label: 'Ответы на вопросы покупателей', field: 'AU_Questions' },
  { label: 'Финансовая аналитика', field: 'AU_FinancialAnalytics' },
  { label: 'Контроль прибыли', field: 'AU_ProfitControl' },
  { label: 'Формирование отчетов', field: 'AU_Reports' },
  { label: 'Прогнозирование спроса', field: 'AU_DemandForecast' },
  { label: 'Поиск новых ниш', field: 'AU_NewNiches' },
  { label: 'Поиск новых товаров', field: 'AU_NewProducts' },
  { label: 'Анализ поставщиков', field: 'AU_SupplierAnalysis' },
  { label: 'Работа с поставщиками', field: 'AU_Suppliers' },
  { label: 'Логистика', field: 'AU_Logistics' },
  { label: 'Работа с возвратами', field: 'AU_Returns' },
  { label: 'Автоматизация документов', field: 'AU_Documents' },
  {
    label: 'Автоматизация всего бизнеса',
    field: 'AU_FullBusinessAutomation',
  },
  { label: 'Другое', field: 'AU_Other', otherTextField: 'AU_Other_Text' },
]

const QUESTIONS = {
  marketplaces: {
    label: 'Где вы продаете?',
    type: 'checkbox',
    options: [
      'Wildberries',
      'Ozon',
      'Яндекс Маркет',
      'Другие маркетплейсы',
      'Свой интернет-магазин',
      'Соцсети и мессенджеры',
    ],
  },
  sku: {
    label: 'Сколько у вас SKU?',
    type: 'radio',
    options: ['До 50', '51–200', '201–1000', 'Более 1000'],
  },
  time: {
    label: 'Что сегодня забирает больше всего времени?',
    type: 'mapped-checkbox',
    max: 5,
    options: TIME_OPTIONS,
  },
  stress: {
    label: 'Что вызывает наибольший стресс?',
    type: 'mapped-checkbox',
    max: 5,
    options: STRESS_OPTIONS,
  },
  automate: {
    label:
      'Если бы завтра можно было автоматизировать несколько процессов, что бы вы выбрали?',
    type: 'mapped-checkbox',
    max: 5,
    options: AUTOMATE_OPTIONS,
  },
  tools: {
    label: 'Чем вы пользуетесь сегодня?',
    type: 'checkbox',
    options: [
      'Кабинеты маркетплейсов',
      'Excel / Google Таблицы',
      'Сервисы аналитики (MPSTATS и аналоги)',
      'Сервисы учёта (SellerBoard и аналоги)',
      'CRM',
      '1С / бухгалтерия',
      'Telegram-боты',
      'Ничего специального',
      'Другое',
    ],
  },
  format: {
    label: 'Какой формат инструмента был бы удобнее?',
    type: 'radio',
    options: [
      'Веб-сервис в браузере',
      'Telegram-бот',
      'Расширение для браузера',
      'Мобильное приложение',
      'Интеграция в Excel / Google Таблицы',
    ],
  },
  primaryAiPain: {
    label:
      'Если бы мы завтра сделали для вас один AI-инструмент, какую проблему он должен решить в первую очередь?',
    type: 'radio-other',
    field: 'primaryAiPain',
    otherTextField: 'Primary_AI_Pain_Other',
    options: [
      'Остатки',
      'Закупки',
      'Реклама',
      'Аналитика',
      'Цены',
      'Контент',
      'Конкуренты',
      'Другое',
    ],
  },
  sourceChannel: {
    label: 'Откуда вы узнали об этом опросе?',
    type: 'radio-other',
    field: 'sourceChannel',
    otherTextField: 'Source_Channel_Other',
    options: ['Telegram', 'Форум', 'VK', 'От знакомого', 'Другое'],
  },
}

const ALL_MAPPED_OPTIONS = [
  ...TIME_OPTIONS,
  ...STRESS_OPTIONS,
  ...AUTOMATE_OPTIONS,
]

function createInitialCheckboxes() {
  const checkboxes = {}
  ALL_MAPPED_OPTIONS.forEach(({ field }) => {
    checkboxes[field] = false
  })
  return checkboxes
}

function createInitialOtherTexts() {
  return {
    TC_Other_Text: '',
    ST_Other_Text: '',
    AU_Other_Text: '',
    Primary_AI_Pain_Other: '',
    Source_Channel_Other: '',
  }
}

const INITIAL_ANSWERS = {
  marketplaces: [],
  sku: '',
  checkboxes: createInitialCheckboxes(),
  otherTexts: createInitialOtherTexts(),
  tools: [],
  format: '',
  primaryAiPain: '',
  sourceChannel: '',
  telegram: '',
}

function yn(checked) {
  return checked ? 'Y' : ''
}

function appendMappedFields(payload, options, checkboxes, otherTexts) {
  options.forEach(({ field, otherTextField }) => {
    payload[field] = yn(checkboxes[field])
    if (otherTextField) {
      payload[otherTextField] = checkboxes[field]
        ? otherTexts[otherTextField].trim()
        : ''
    }
  })
}

function countSelected(options, checkboxes) {
  return options.filter(({ field }) => checkboxes[field]).length
}

function buildPayload(answers) {
  const payload = {
    source: 'landing_page',
    marketplaces: answers.marketplaces,
    sku: answers.sku,
    tools: answers.tools,
    format: answers.format,
    telegram: answers.telegram.trim(),
    Primary_AI_Pain: answers.primaryAiPain,
    Primary_AI_Pain_Other:
      answers.primaryAiPain === 'Другое'
        ? answers.otherTexts.Primary_AI_Pain_Other.trim()
        : '',
    Source_Channel: answers.sourceChannel,
    Source_Channel_Other:
      answers.sourceChannel === 'Другое'
        ? answers.otherTexts.Source_Channel_Other.trim()
        : '',
  }

  appendMappedFields(
    payload,
    TIME_OPTIONS,
    answers.checkboxes,
    answers.otherTexts,
  )
  appendMappedFields(
    payload,
    STRESS_OPTIONS,
    answers.checkboxes,
    answers.otherTexts,
  )
  appendMappedFields(
    payload,
    AUTOMATE_OPTIONS,
    answers.checkboxes,
    answers.otherTexts,
  )

  return payload
}

function App() {
  const surveyRef = useRef(null)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [errors, setErrors] = useState({})
  const [limitMessages, setLimitMessages] = useState({})
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const scrollToSurvey = () => {
    track('Survey Started')
    surveyRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleCheckbox = (field, value, max) => {
    setLimitMessages((prev) => ({ ...prev, [field]: '' }))
    setErrors((prev) => ({ ...prev, [field]: '' }))

    setAnswers((prev) => {
      const current = prev[field]
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((item) => item !== value) }
      }
      if (max && current.length >= max) {
        setLimitMessages((prevLimits) => ({
          ...prevLimits,
          [field]: LIMIT_MESSAGE,
        }))
        return prev
      }
      return { ...prev, [field]: [...current, value] }
    })
  }

  const toggleMappedCheckbox = (questionId, optionField, max, options) => {
    setLimitMessages((prev) => ({ ...prev, [questionId]: '' }))
    setErrors((prev) => ({ ...prev, [questionId]: '' }))

    setAnswers((prev) => {
      const isSelected = prev.checkboxes[optionField]
      if (isSelected) {
        return {
          ...prev,
          checkboxes: { ...prev.checkboxes, [optionField]: false },
        }
      }
      if (max && countSelected(options, prev.checkboxes) >= max) {
        setLimitMessages((prevLimits) => ({
          ...prevLimits,
          [questionId]: LIMIT_MESSAGE,
        }))
        return prev
      }
      return {
        ...prev,
        checkboxes: { ...prev.checkboxes, [optionField]: true },
      }
    })
  }

  const setOtherText = (textField, value) => {
    setAnswers((prev) => ({
      ...prev,
      otherTexts: { ...prev.otherTexts, [textField]: value },
    }))
  }

  const setRadio = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: '' }))
    setAnswers((prev) => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const nextErrors = {}

    if (answers.marketplaces.length === 0) {
      nextErrors.marketplaces = 'Выберите хотя бы один вариант'
    }
    if (!answers.sku) {
      nextErrors.sku = 'Выберите один вариант'
    }
    if (countSelected(TIME_OPTIONS, answers.checkboxes) === 0) {
      nextErrors.time = 'Выберите хотя бы один вариант'
    }
    if (countSelected(STRESS_OPTIONS, answers.checkboxes) === 0) {
      nextErrors.stress = 'Выберите хотя бы один вариант'
    }
    if (countSelected(AUTOMATE_OPTIONS, answers.checkboxes) === 0) {
      nextErrors.automate = 'Выберите хотя бы один вариант'
    }
    if (answers.tools.length === 0) {
      nextErrors.tools = 'Выберите хотя бы один вариант'
    }
    if (!answers.format) {
      nextErrors.format = 'Выберите один вариант'
    }
    if (!answers.primaryAiPain) {
      nextErrors.primaryAiPain = 'Выберите один вариант'
    }
    if (!answers.sourceChannel) {
      nextErrors.sourceChannel = 'Выберите один вариант'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setFormError('Пожалуйста, ответьте на все обязательные вопросы.')
      surveyRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    const payload = buildPayload(answers)
    console.log(payload)

    setIsSubmitting(true)
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
      })

      track('Survey Submitted')
      setSubmitted(true)
      surveyRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (error) {
      console.error(error)
      console.log(payload)
      setFormError('Ошибка сохранения. Попробуйте еще раз.')
      surveyRef.current?.scrollIntoView({ behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCheckboxQuestion = (field) => {
    const { label, options, max } = QUESTIONS[field]

    return (
      <fieldset
        key={field}
        className={`question${errors[field] ? ' question--error' : ''}`}
      >
        <legend className="question__label">
          {label}
          {max ? (
            <span className="question__hint"> (до {max} вариантов)</span>
          ) : null}
        </legend>
        <div className="options">
          {options.map((option) => (
            <label key={option} className="option">
              <input
                type="checkbox"
                name={field}
                value={option}
                checked={answers[field].includes(option)}
                onChange={() => toggleCheckbox(field, option, max)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {limitMessages[field] ? (
          <p className="limit-error" role="alert">
            {limitMessages[field]}
          </p>
        ) : null}
        {errors[field] ? (
          <p className="field-error" role="alert">
            {errors[field]}
          </p>
        ) : null}
      </fieldset>
    )
  }

  const renderMappedCheckboxQuestion = (field) => {
    const { label, options, max } = QUESTIONS[field]

    return (
      <fieldset
        key={field}
        className={`question${errors[field] ? ' question--error' : ''}`}
      >
        <legend className="question__label">
          {label}
          {max ? (
            <span className="question__hint"> (до {max} вариантов)</span>
          ) : null}
        </legend>
        <div className="options">
          {options.map(({ label: optionLabel, field: optionField, otherTextField }) => (
            <div key={optionField} className="option-group">
              <label className="option">
                <input
                  type="checkbox"
                  name={optionField}
                  checked={answers.checkboxes[optionField]}
                  onChange={() =>
                    toggleMappedCheckbox(field, optionField, max, options)
                  }
                />
                <span>{optionLabel}</span>
              </label>
              {otherTextField && answers.checkboxes[optionField] ? (
                <input
                  type="text"
                  className="text-input option-other-input"
                  placeholder="Уточните"
                  value={answers.otherTexts[otherTextField]}
                  onChange={(event) =>
                    setOtherText(otherTextField, event.target.value)
                  }
                  autoComplete="off"
                />
              ) : null}
            </div>
          ))}
        </div>
        {limitMessages[field] ? (
          <p className="limit-error" role="alert">
            {limitMessages[field]}
          </p>
        ) : null}
        {errors[field] ? (
          <p className="field-error" role="alert">
            {errors[field]}
          </p>
        ) : null}
      </fieldset>
    )
  }

  const renderRadioQuestion = (field) => {
    const { label, options } = QUESTIONS[field]

    return (
      <fieldset
        key={field}
        className={`question${errors[field] ? ' question--error' : ''}`}
      >
        <legend className="question__label">{label}</legend>
        <div className="options">
          {options.map((option) => (
            <label key={option} className="option">
              <input
                type="radio"
                name={field}
                value={option}
                checked={answers[field] === option}
                onChange={() => setRadio(field, option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors[field] ? (
          <p className="field-error" role="alert">
            {errors[field]}
          </p>
        ) : null}
      </fieldset>
    )
  }

  const renderRadioOtherQuestion = (field) => {
    const { label, options, field: answerField, otherTextField } =
      QUESTIONS[field]
    const selected = answers[answerField]

    return (
      <fieldset
        key={field}
        className={`question${errors[field] ? ' question--error' : ''}`}
      >
        <legend className="question__label">{label}</legend>
        <div className="options">
          {options.map((option) => (
            <div key={option} className="option-group">
              <label className="option">
                <input
                  type="radio"
                  name={field}
                  value={option}
                  checked={selected === option}
                  onChange={() => setRadio(answerField, option)}
                />
                <span>{option}</span>
              </label>
              {option === 'Другое' && selected === 'Другое' ? (
                <input
                  type="text"
                  className="text-input option-other-input"
                  placeholder="Уточните"
                  value={answers.otherTexts[otherTextField]}
                  onChange={(event) =>
                    setOtherText(otherTextField, event.target.value)
                  }
                  autoComplete="off"
                />
              ) : null}
            </div>
          ))}
        </div>
        {errors[field] ? (
          <p className="field-error" role="alert">
            {errors[field]}
          </p>
        ) : null}
      </fieldset>
    )
  }

  return (
    <div className="page">
      <section className="hero section">
        <div className="container">
          <h1>
            Помогите создать AI-инструмент, который будет экономить часы работы
            селлерам — вам
          </h1>
          <p className="hero__subheadline">
            Мы ищем первых пользователей и собираем реальные боли продавцов
            Wildberries, Ozon и Яндекс Маркета. Пройдите короткий опрос за 1
            минуту и получите возможность бесплатно протестировать будущий
            продукт одним из первых.
          </p>
          <div className="hero__cta">
            <button type="button" className="btn" onClick={scrollToSurvey}>
              Пройти опрос
            </button>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <h2 className="section__title">Что получат участники</h2>
          <div className="benefits__grid">
            {BENEFITS.map((text) => (
              <article key={text} className="benefit-card">
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="survey"
        ref={surveyRef}
        className="section"
        aria-labelledby="survey-heading"
      >
        <div className="container">
          <h2 id="survey-heading" className="section__title">
            Опрос
          </h2>

          {submitted ? (
            <div className="thank-you">
              <h2>Спасибо!</h2>
              <p>
                Вы добавлены в список раннего доступа. Мы анализируем ответы
                продавцов WB, Ozon и Яндекс Маркета. После завершения
                исследования вы получите рейтинг главных болей рынка, информацию
                о выбранном направлении разработки и приглашение на закрытое
                тестирование.
              </p>
            </div>
          ) : (
            <>
              <p className="survey__intro">
                Все вопросы обязательны, кроме поля Telegram.
              </p>
              <form className="survey-form" onSubmit={handleSubmit} noValidate>
                {renderCheckboxQuestion('marketplaces')}
                {renderRadioQuestion('sku')}
                {renderMappedCheckboxQuestion('time')}
                {renderMappedCheckboxQuestion('stress')}
                {renderMappedCheckboxQuestion('automate')}
                {renderCheckboxQuestion('tools')}
                {renderRadioQuestion('format')}
                {renderRadioOtherQuestion('primaryAiPain')}
                {renderRadioOtherQuestion('sourceChannel')}

                <fieldset className="question">
                  <legend className="question__label">
                    Telegram для раннего доступа
                    <span className="question__hint"> (необязательно)</span>
                  </legend>
                  <input
                    type="text"
                    className="text-input"
                    placeholder="@username или номер телефона"
                    value={answers.telegram}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        telegram: event.target.value,
                      }))
                    }
                    autoComplete="off"
                  />
                </fieldset>

                {formError ? (
                  <p className="form-error" role="alert">
                    {formError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="btn btn--full"
                  disabled={isSubmitting}
                >
                  Отправить ответы
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>Исследование болей продавцов маркетплейсов · 2026</p>
          <p className="footer__version">Build Version: 1.0.1</p>
        </div>
      </footer>
    </div>
  )
}

export default App
