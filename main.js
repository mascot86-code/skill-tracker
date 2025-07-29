const skills = getAppState()

// const skills = []

const skillsContent = document.querySelector('#skills-content')
let html = ''
const modal = document.querySelector('#modal')
const closeBtn = document.querySelector('#close-modal')
const modalOverlay = document.querySelector('#modal-overlay')
const progress = document.querySelector('#progress')
const doneCheckbox = document.querySelector('#done-checkbox')
const modalContent = document.querySelector('#modal-content')
const form = document.querySelector('#add-skill-form')
const theme = document.querySelector('.ikxBAC')
const styles = document.querySelector('#styles')

theme.addEventListener('change', changeTheme)

function changeTheme() {
  if (theme.checked) {
    localStorage.setItem('theme', 'dark')
  } else {
    localStorage.setItem('theme', 'light')
  }

  location.reload()
}


function setTheme() {
  if (localStorage.getItem('theme') == 'dark') {
    document.body.classList.add('dark-mode')
    styles.href = 'dark.css'
    theme.checked = true
  } else {
    document.body.classList.remove('dark-mode')
    styles.href = 'main.css'
    theme.checked = false
  }
}


function init() {
  renderCards()
  modals()
  renderProgress()
  addNewSkill()
  setTheme()
}

function renderProgress() {
  const percent = computedProgressPercent()
  progress.style.width = `${percent}%`
  progress.textContent = percent ? `${percent}%` : ''

  if (percent <= 30) {
    progress.style.background = '#C86665'
  } else if (percent > 30 && percent <= 70) {
    progress.style.background = '#FF652F'
  } else {
    progress.style.background = '#13A76B'
  }
}

function computedProgressPercent() {
  if (skills.length === 0) return 0
  const doneSkills = skills.filter(skill => skill.done).length
  const totalSkills = skills.length
  const totalPercent = Math.round((100 * doneSkills) / totalSkills)
  return totalPercent
}

function renderCards() {
  if (skills.length === 0) {
    return skillsContent.innerHTML = '<p class="empty">Технологий пока нет! Добавьте первую!</p>'
  }

  skillsContent.innerHTML = skills.map(skill => {
    return toCard(skill)
  }).join('')

  function toCard(skill) {
    const done = skill.done ? 'done' : ''
    return `<div class="skill-item ${done}" data-type="${skill.type}"><h3 class="skill-title" data-type="${skill.type}">${skill.title}</h3></div>`
  }
}

function modals() {
  skillsContent.addEventListener('click', openModal)
  closeBtn.addEventListener('click', closeModal)
  modalOverlay.addEventListener('click', closeModal)
  modal.addEventListener('change', changeSkillStatus)
  modal.addEventListener('click', deleteSkill)

  function openModal(event) {
    const data = event.target.dataset
    const skill = skills.find(skill => skill.type === data.type)
    if (skill) {
      document.title = skill.title + ' | Skills tracker'
      modalContent.innerHTML = `
      
      <div class="modal-title">
        ${skill.title}
      </div>
      <div class="modal-text">
        ${skill.text}
      </div>
      <div class="hr"></div>
      <div class="modal-bottom">
        <div class="done" id="done">
          <input type="checkbox" id="done-checkbox" ${skill.done ? 'checked' : ''} data-type="${skill.type}">
          <label for="done-checkbox">Выучил технологию</label>
        </div>
        <a class="delete" href="#" data-type="${skill.type}">Удалить технологию</a>
      </div> 
      `
    }
    if (event.target.classList.contains('skill-item') || event.target.classList.contains('skill-title')) {
      modal.classList.toggle('open')
    }
  }

  function closeModal() {
    modal.classList.remove('open')
    document.title = 'Skills tracker'
  }

  function changeSkillStatus(event) {
    const type = event.target.dataset.type
    const skill = skills.find(skill => skill.type === type)
    skill.done = !skill.done
    saveAppState()
    renderCards()
    renderProgress()
    closeModal()
  }

  function deleteSkill(event) {
    const target = event.target
    if (target.className !== 'delete') return
    const type = event.target.dataset.type
    skills.splice(skills.findIndex(skill => skill.type === type), 1)
    saveAppState()
    renderCards()
    renderProgress()
    closeModal()
  }
}

function isInvalid(title, description) {
  return !title || !description
}


function addNewSkill() {
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    // let title = form.querySelector('#skill-name').value
    // let text = form.querySelector('#skill-text').value
    let title = event.target.title.value.trim()
    let text = event.target.description.value.trim()

    if (isInvalid(title, description)) {
      return alert('Заполните все поля')
    }

    const newSkill = {
      title,
      text,
      type: title.toLowerCase(),
      done: false
    }
    skills.push(newSkill)
    saveAppState()
    form.reset()
    renderCards()
    renderProgress()
  })
}

function saveAppState() {
  localStorage.setItem('skills', JSON.stringify(skills))
}

function getAppState() {
  const row = localStorage.getItem('skills')
  return row ? JSON.parse(row) : []
}

init()
