const skills = [
  { title: 'HTML', text: 'HTML text', type: 'html', done: true },
  { title: 'JavaScript', text: 'JavaScript text', type: 'js', done: true },
  { title: 'Git', text: 'Git text', type: 'git', done: false },
  { title: 'React', text: 'React text', type: 'react', done: false },
  { title: 'Vue', text: 'Vue text', type: 'vue', done: false },
]

// const skills = []

const skillsContent = document.querySelector('#skills-content')
let html = ''
const modal = document.querySelector('#modal')
const closeBtn = document.querySelector('#close-modal')
const modalOverlay = document.querySelector('#modal-overlay')
const progress = document.querySelector('#progress')
const doneCheckbox = document.querySelector('#done-checkbox')
const modalContent = document.querySelector('#modal-content')


function init() {
  renderCards()
  modals()
  renderProgress()
  addNewSkill()
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
      <div class="done" id="done">
        <input type="checkbox" id="done-checkbox" ${skill.done ? 'checked' : ''} data-type="${skill.type}">
        <label for="done-checkbox">Выучил технологию</label>
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
    renderCards()
    renderProgress()
    closeModal()
  }
}


function addNewSkill() {
  const form = document.querySelector('#add-skill-form')
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    let title = form.querySelector('#skill-name').value
    let text = form.querySelector('#skill-text').value
    const newSkill = {
      title,
      text,
      type: title.toLowerCase(),
      done: false
    }
    skills.push(newSkill)
    form.reset()
    renderCards()
    renderProgress()
  })
}

init()
